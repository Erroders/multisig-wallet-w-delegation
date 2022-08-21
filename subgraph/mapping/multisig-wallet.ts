import { BigInt, ipfs, json } from "@graphprotocol/graph-ts";
import {
    Delegate,
    RevokeDelegation,
    SignerAdded,
    TransactionApproved,
    TransactionCreated,
    TransactionExecuted,
    WalletCreated,
} from "../generated/MultisigWallet/MultisigWallet";
import {
    Signer,
    SignerMetadata,
    Transaction,
    Wallet,
} from "../generated/schema";

export function handleDelegate(event: Delegate): void {
    let signer = Signer.load(event.params.from.toHex());
    if (signer) {
        let to: string | null = event.params.to.toHex();
        while (to && to.length != 0) {
            let delegate_ = Signer.load(to);
            if (delegate_) {
                delegate_.weight = delegate_.weight.plus(signer.weight);
                to = delegate_.delegateTo;
                delegate_.save();
            }
        }
        signer.delegateTo = event.params.to.toHex();
        signer.save();
    }
}
// Note: If a handler doesn't require existing field values, it is faster
// _not_ to load the entity from the store. Instead, create it fresh with
// `new Entity(...)`, set the fields that should be updated and save the
// entity back to the store. Fields that were not set or unset remain
// unchanged, allowing for partial updates to be applied.

// It is also possible to access smart contracts from mappings. For
// example, the contract that has emitted the event can be connected to
// with:
//
// let contract = Contract.bind(event.address)
//
// The following functions can then be called on this contract to access
// state variables and other data:
//
// - contract._lockedBalance(...)
// - contract._owner(...)
// - contract._signerCount(...)
// - contract._txnId(...)
// - contract.signers(...)
// - contract.transactions(...)

export function handleRevokeDelegation(event: RevokeDelegation): void {
    let signer = Signer.load(event.params.signer.toHex());
    if (signer) {
        let delegateAddr = signer.delegateTo;
        if (delegateAddr) {
            while (delegateAddr.length != 0) {
                let delegate_ = Signer.load(delegateAddr);
                if (delegate_) {
                    delegate_.weight = delegate_.weight.minus(signer.weight);
                    delegateAddr = delegate_.delegateTo!;
                    delegate_.save();
                }
            }
        }
        signer.delegateTo = "";
        signer.save();
    }
}

export function handleSignerAdded(event: SignerAdded): void {
    let signer = Signer.load(event.params.signerAddress.toHex());
    if (!signer) {
        signer = new Signer(event.params.signerAddress.toHex());
        signer.address = event.params.signerAddress;
        signer.weight = BigInt.fromString("1");

        let ipfsData = ipfs.cat(event.params.cid.toString());
        if (ipfsData) {
            let jsonData = json.fromBytes(ipfsData);
            let object = jsonData.toObject();

            if (object) {
                let signerMetadata = new SignerMetadata(
                    event.params.signerAddress.toHex()
                );
                signerMetadata.name = object.get("name")!.toString();
                signerMetadata.contactNo = object.get("contactNo")!.toString();
                signerMetadata.email = object.get("email")!.toString();
                signerMetadata.walletAddress = event.params.signerAddress;
                signerMetadata.role = object.get("role")!.toString();
                if (object.get("remarks")!.toString()) {
                    signerMetadata.remarks = object.get("remarks")!.toString();
                }
                signerMetadata.save();
                signer.metadata = event.params.signerAddress.toHex();
            }
        }
        signer.save();
        let wallet = Wallet.load(event.address.toHex());
        if (wallet) {
            let tempSigners = wallet.signers;
            tempSigners.push(event.params.signerAddress.toHex());
            wallet.signers = tempSigners;
            wallet.save();
        }
    }
}

export function handleTransactionApproved(event: TransactionApproved): void {
    let txn = Transaction.load(event.params.txnId.toString());
    let approver = Signer.load(event.params.approver.toHex());
    if (txn && approver) {
        txn.approval = txn.approval.plus(approver.weight);
        let tempApprovedBy = txn.approvedBy;
        if (tempApprovedBy) {
            tempApprovedBy.push(event.params.approver.toHex());
            txn.approvedBy = tempApprovedBy;
        }
        txn.save();
    }
}

export function handleTransactionCreated(event: TransactionCreated): void {
    let txn = Transaction.load(event.params.txnId.toString());
    if (!txn) {
        txn = new Transaction(event.params.txnId.toString());
        txn.to = event.params.to;
        txn.amount = event.params.amount;
        txn.approval = BigInt.fromString("0");
        txn.executed = false;
        txn.createdOn = event.block.timestamp;
        txn.approvedBy = [];

        let wallet = Wallet.load(event.address.toHex());
        if (wallet) {
            let tempTxns = wallet.transactions;
            if (tempTxns) {
                tempTxns.push(event.params.txnId.toString());
                wallet.transactions = tempTxns;
            }
            wallet.lockedBalance = wallet.lockedBalance.plus(
                event.params.amount
            );
            wallet.save();
        }
        txn.save();
    }
}

export function handleTransactionExecuted(event: TransactionExecuted): void {
    let txn = Transaction.load(event.params.txnId.toString());
    let approver = Signer.load(event.params.approver.toHex());
    if (txn && approver) {
        txn.executed = true;
        let tempApprovedBy = txn.approvedBy;
        if (tempApprovedBy) {
            tempApprovedBy.push(event.params.approver.toHex());
            txn.approvedBy = tempApprovedBy;
        }

        let wallet = Wallet.load(event.address.toHex());
        if (wallet) {
            wallet.lockedBalance = wallet.lockedBalance.minus(txn.amount);
            wallet.save();
        }
        txn.save();
    }
}

export function handleWalletCreated(event: WalletCreated): void {
    let wallet = Wallet.load(event.address.toHex());
    if (!wallet) {
        wallet = new Wallet(event.address.toHex());
        wallet.lockedBalance = BigInt.fromString("0");
        wallet.transactions = [];
        wallet.signers = [];

        let signer = Signer.load(event.params.ownerAddress.toHex());
        if (!signer) {
            signer = new Signer(event.params.ownerAddress.toHex());
            signer.address = event.params.ownerAddress;
            signer.weight = BigInt.fromString("1");

            let ipfsData = ipfs.cat(event.params.ownerCid.toString());
            if (ipfsData) {
                let jsonData = json.fromBytes(ipfsData);
                let object = jsonData.toObject();

                if (object) {
                    let signerMetadata = new SignerMetadata(
                        event.params.ownerAddress.toHex()
                    );
                    signerMetadata.name = object.get("name")!.toString();
                    signerMetadata.contactNo = object
                        .get("contactNo")!
                        .toString();
                    signerMetadata.email = object.get("email")!.toString();
                    signerMetadata.walletAddress = event.params.ownerAddress;
                    signerMetadata.role = object.get("role")!.toString();
                    if (object.get("remarks")!.toString()) {
                        signerMetadata.remarks = object
                            .get("remarks")!
                            .toString();
                    }
                    signerMetadata.save();
                    signer.metadata = event.params.ownerAddress.toHex();
                }
            }
            signer.save();
        }
        wallet.owner = event.params.ownerAddress.toHex();
        let tempSigners = wallet.signers;
        tempSigners.push(event.params.ownerAddress.toHex());
        wallet.signers = tempSigners;
        wallet.save();
    }
}
