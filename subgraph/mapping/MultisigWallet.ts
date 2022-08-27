import { BigInt, ipfs, json, store } from "@graphprotocol/graph-ts";
import {
    Delegate,
    RevokeDelegation,
    SignerAdded,
    ERC20TransactionApproved,
    ERC20TransactionCreated,
    ERC20TransactionExecuted,
    ERC20TransactionDisapproved,
    ERC20TransactionCancelled,
    ERC721TransactionApproved,
    ERC721TransactionCreated,
    ERC721TransactionExecuted,
    ERC721TransactionDisapproved,
    ERC721TransactionCancelled,
    ERC1155TransactionApproved,
    ERC1155TransactionCreated,
    ERC1155TransactionExecuted,
    ERC1155TransactionDisapproved,
    ERC1155TransactionCancelled,
} from "../generated/templates/MultisigWallet/MultisigWallet";
import {
    Signer,
    SignerMetadata,
    ERC20Transaction,
    ERC20LockedBalance,
    ERC721Transaction,
    ERC721LockedBalance,
    ERC1155Transaction,
    ERC1155LockedBalance,
    Wallet,
} from "../generated/schema";

// Signer --------------------------------------------------------------------

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

export function handleRevokeDelegation(event: RevokeDelegation): void {
    let signer = Signer.load(event.params.signer.toHex());
    if (signer) {
        let delegateAddr: string | null = signer.delegateTo;
        while (delegateAddr && delegateAddr.length != 0) {
            let delegate_ = Signer.load(delegateAddr);
            if (delegate_) {
                delegate_.weight = delegate_.weight.minus(signer.weight);
                delegateAddr = delegate_.delegateTo;
                delegate_.save();
            }
        }
        signer.delegateTo = null;
        signer.save();
    }
}

export function handleSignerAdded(event: SignerAdded): void {
    let signer = Signer.load(event.params.signerAddress.toHex());
    if (!signer) {
        signer = new Signer(event.params.signerAddress.toHex());
        signer.address = event.params.signerAddress;
        signer.weight = BigInt.fromString("1");
        signer.txnCap = event.params.txnCap;

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

// ERC20 --------------------------------------------------------------------

export function handleERC20TransactionCreated(
    event: ERC20TransactionCreated
): void {
    let txn = ERC20Transaction.load(event.params.txnId.toString());
    if (!txn) {
        txn = new ERC20Transaction(event.params.txnId.toString());
        txn.to = event.params.to;
        txn.contractAddr = event.params.contractAddr;
        txn.amount = event.params.amount;
        txn.approval = BigInt.fromString("0");
        txn.disapproval = BigInt.fromString("0");
        txn.createdOn = event.block.timestamp;
        txn.txnStatus = "CREATED";
        txn.approvedBy = [];
        txn.disapprovedBy = [];

        let wallet = Wallet.load(event.address.toHex());
        if (wallet) {
            let tempTxns = wallet.erc20Transactions;
            if (tempTxns) {
                tempTxns.push(event.params.txnId.toString());
                wallet.erc20Transactions = tempTxns;
            }
            let id = event.address.toHex() + event.params.contractAddr.toHex();
            let lockedERC20Balance = new ERC20LockedBalance(id);
            lockedERC20Balance.lockedBalance =
                lockedERC20Balance.lockedBalance.plus(event.params.amount);

            lockedERC20Balance.save();
            wallet.save();
        }
        txn.save();
    }
}

export function handleERC20TransactionApproved(
    event: ERC20TransactionApproved
): void {
    let txn = ERC20Transaction.load(event.params.txnId.toString());
    let approver = Signer.load(event.params.approver.toHex());
    if (txn && approver) {
        txn.approval = txn.approval.plus(approver.weight);
        let tempApprovedBy = txn.approvedBy;
        if (tempApprovedBy) {
            tempApprovedBy.push(event.params.approver.toHex());
            txn.approvedBy = tempApprovedBy;
        }
        txn.txnStatus = "WAITING_APPROVAL";
        txn.save();
    }
}

export function handleERC20TransactionDisapproved(
    event: ERC20TransactionDisapproved
): void {
    let txn = ERC20Transaction.load(event.params.txnId.toString());
    let disapprover = Signer.load(event.params.disapprover.toHex());
    if (txn && disapprover) {
        txn.disapproval = txn.disapproval.plus(disapprover.weight);
        let tempDisapprovedBy = txn.disapprovedBy;
        if (tempDisapprovedBy) {
            tempDisapprovedBy.push(event.params.disapprover.toHex());
            txn.disapprovedBy = tempDisapprovedBy;
        }
        txn.txnStatus = "WAITING_APPROVAL";
        txn.save();
    }
}

export function handleERC20TransactionExecuted(
    event: ERC20TransactionExecuted
): void {
    let txn = ERC20Transaction.load(event.params.txnId.toString());
    if (txn) {
        txn.txnStatus = "EXECUTED";
        let id = event.address.toHex() + txn.contractAddr.toHex();
        let lockedERC20Balance = ERC20LockedBalance.load(id);
        if (lockedERC20Balance) {
            lockedERC20Balance.lockedBalance =
                lockedERC20Balance.lockedBalance.minus(txn.amount);
            lockedERC20Balance.save();
        }
        txn.save();
    }
}

export function handleERC20TransactionCancelled(
    event: ERC20TransactionCancelled
): void {
    let txn = ERC20Transaction.load(event.params.txnId.toString());
    if (txn) {
        txn.txnStatus = "CANCELLED";
        let id = event.address.toHex() + txn.contractAddr.toHex();
        let lockedERC20Balance = ERC20LockedBalance.load(id);
        if (lockedERC20Balance) {
            lockedERC20Balance.lockedBalance =
                lockedERC20Balance.lockedBalance.minus(txn.amount);
            lockedERC20Balance.save();
        }
        txn.save();
    }
}

// ERC721 ---------------------------------------------------------------------
export function handleERC721TransactionCreated(
    event: ERC721TransactionCreated
): void {
    let txn = ERC721Transaction.load(event.params.txnId.toString());
    if (!txn) {
        txn = new ERC721Transaction(event.params.txnId.toString());
        txn.to = event.params.to;
        txn.tokenId = event.params.tokenId;
        txn.contractAddr = event.params.contractAddr;
        txn.approval = BigInt.fromString("0");
        txn.disapproval = BigInt.fromString("0");
        txn.createdOn = event.block.timestamp;
        txn.txnStatus = "CREATED";
        txn.approvedBy = [];
        txn.disapprovedBy = [];

        let wallet = Wallet.load(event.address.toHex());
        if (wallet) {
            let tempTxns = wallet.erc721Transactions;
            if (tempTxns) {
                tempTxns.push(event.params.txnId.toString());
                wallet.erc721Transactions = tempTxns;
            }
            let id =
                event.address.toHex() +
                event.params.contractAddr.toHex() +
                event.params.tokenId.toString();
            let lockedERC721Balance = new ERC721LockedBalance(id);
            lockedERC721Balance.lockedBool = true;
            lockedERC721Balance.save();
            wallet.save();
        }
        txn.save();
    }
}

export function handleERC721TransactionApproved(
    event: ERC721TransactionApproved
): void {
    let txn = ERC721Transaction.load(event.params.txnId.toString());
    let approver = Signer.load(event.params.approver.toHex());
    if (txn && approver) {
        txn.approval = txn.approval.plus(approver.weight);
        let tempApprovedBy = txn.approvedBy;
        if (tempApprovedBy) {
            tempApprovedBy.push(event.params.approver.toHex());
            txn.approvedBy = tempApprovedBy;
        }
        txn.txnStatus = "WAITING_APPROVAL";
        txn.save();
    }
}

export function handleERC721TransactionDisapproved(
    event: ERC721TransactionDisapproved
): void {
    let txn = ERC721Transaction.load(event.params.txnId.toString());
    let disapprover = Signer.load(event.params.disapprover.toHex());
    if (txn && disapprover) {
        txn.disapproval = txn.disapproval.plus(disapprover.weight);
        let tempDisapprovedBy = txn.disapprovedBy;
        if (tempDisapprovedBy) {
            tempDisapprovedBy.push(event.params.disapprover.toHex());
            txn.disapprovedBy = tempDisapprovedBy;
        }
        txn.save();
    }
}

export function handleERC721TransactionExecuted(
    event: ERC721TransactionExecuted
): void {
    let txn = ERC721Transaction.load(event.params.txnId.toString());
    if (txn) {
        txn.txnStatus = "EXECUTED";
        let id =
            event.address.toHex() +
            txn.contractAddr.toHex() +
            txn.tokenId.toString();
        store.remove("ERC721LockedBalance", id);
        txn.save();
    }
}

export function handleERC721TransactionCancelled(
    event: ERC721TransactionCancelled
): void {
    let txn = ERC721Transaction.load(event.params.txnId.toString());
    if (txn) {
        txn.txnStatus = "CANCELLED";
        let id =
            event.address.toHex() +
            txn.contractAddr.toHex() +
            txn.tokenId.toString();
        store.remove("ERC721LockedBalance", id);
        txn.save();
    }
}

// ERC1155 --------------------------------------------------------------------
export function handleERC1155TransactionCreated(
    event: ERC1155TransactionCreated
): void {
    let txn = ERC1155Transaction.load(event.params.txnId.toString());
    if (!txn) {
        txn = new ERC1155Transaction(event.params.txnId.toString());
        txn.to = event.params.to;
        txn.tokenId = event.params.tokenId;
        txn.contractAddr = event.params.contractAddr;
        txn.amount = event.params.amount;
        txn.approval = BigInt.fromString("0");
        txn.disapproval = BigInt.fromString("0");
        txn.createdOn = event.block.timestamp;
        txn.txnStatus = "CREATED";
        txn.approvedBy = [];
        txn.disapprovedBy = [];

        let wallet = Wallet.load(event.address.toHex());
        if (wallet) {
            let tempTxns = wallet.erc1155Transactions;
            if (tempTxns) {
                tempTxns.push(event.params.txnId.toString());
                wallet.erc1155Transactions = tempTxns;
            }
            let id =
                event.address.toHex() +
                event.params.contractAddr.toHex() +
                event.params.tokenId.toString();
            let lockedERC1155Balance = new ERC1155LockedBalance(id);
            lockedERC1155Balance.lockedBalance =
                lockedERC1155Balance.lockedBalance.plus(event.params.amount);
            lockedERC1155Balance.save();
            wallet.save();
        }
        txn.save();
    }
}

export function handleERC1155TransactionApproved(
    event: ERC1155TransactionApproved
): void {
    let txn = ERC1155Transaction.load(event.params.txnId.toString());
    let approver = Signer.load(event.params.approver.toHex());
    if (txn && approver) {
        txn.approval = txn.approval.plus(approver.weight);
        let tempApprovedBy = txn.approvedBy;
        if (tempApprovedBy) {
            tempApprovedBy.push(event.params.approver.toHex());
            txn.approvedBy = tempApprovedBy;
        }
        txn.txnStatus = "WAITING_APPROVAL";
        txn.save();
    }
}

export function handleERC1155TransactionDisapproved(
    event: ERC1155TransactionDisapproved
): void {
    let txn = ERC1155Transaction.load(event.params.txnId.toString());
    let disapprover = Signer.load(event.params.disapprover.toHex());
    if (txn && disapprover) {
        txn.disapproval = txn.disapproval.plus(disapprover.weight);
        let tempDisapprovedBy = txn.disapprovedBy;
        if (tempDisapprovedBy) {
            tempDisapprovedBy.push(event.params.disapprover.toHex());
            txn.disapprovedBy = tempDisapprovedBy;
        }
        txn.save();
    }
}

export function handleERC1155TransactionExecuted(
    event: ERC1155TransactionExecuted
): void {
    let txn = ERC1155Transaction.load(event.params.txnId.toString());
    if (txn) {
        txn.txnStatus = "EXECUTED";
        let id =
            event.address.toHex() +
            txn.contractAddr.toHex() +
            txn.tokenId.toString();
        let lockedERC1155Balance = ERC1155LockedBalance.load(id);
        if (lockedERC1155Balance) {
            lockedERC1155Balance.lockedBalance =
                lockedERC1155Balance.lockedBalance.minus(txn.amount);
            lockedERC1155Balance.save();
        }
        txn.save();
    }
}

export function handleERC1155TransactionCancelled(
    event: ERC1155TransactionCancelled
): void {
    let txn = ERC1155Transaction.load(event.params.txnId.toString());
    if (txn) {
        txn.txnStatus = "CANCELLED";
        let id =
            event.address.toHex() +
            txn.contractAddr.toHex() +
            txn.tokenId.toString();
        let lockedERC1155Balance = ERC1155LockedBalance.load(id);
        if (lockedERC1155Balance) {
            lockedERC1155Balance.lockedBalance =
                lockedERC1155Balance.lockedBalance.minus(txn.amount);
            lockedERC1155Balance.save();
        }
        txn.save();
    }
}
