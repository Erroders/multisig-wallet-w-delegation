import { MultisigWallet } from "../generated/templates";
import { WalletCreated } from "../generated/WalletCreator/WalletCreator";
import {
    Signer,
    Wallet,
    WalletMetadata,
    SignerMetadata,
} from "../generated/schema";
import { BigInt, ipfs, json } from "@graphprotocol/graph-ts";

export function handleWalletCreated(event: WalletCreated): void {
    let wallet = Wallet.load(event.params.walletAddress.toHex());
    if (!wallet) {
        MultisigWallet.create(event.params.walletAddress);
        wallet = new Wallet(event.params.walletAddress.toHex());
        wallet.createdOn = event.block.timestamp;
        wallet.erc20Transactions = [];
        wallet.erc721Transactions = [];
        wallet.erc1155Transactions = [];
        let ipfsData = ipfs.cat(event.params.walletCid.toString());
        if (ipfsData) {
            let jsonData = json.fromBytes(ipfsData);
            let object = jsonData.toObject();
            if (object) {
                let walletMetadata = new WalletMetadata(
                    event.params.walletAddress.toHex()
                );
                walletMetadata.title = object.get("title")!.toString();
                walletMetadata.description = object
                    .get("description")!
                    .toString();
                walletMetadata.save();
                wallet.metadata = event.params.walletAddress.toHex();
            }
        }
        let owner = Signer.load(event.params.walletAddress.toHex() + event.params.ownerAddress.toHex());
        if (!owner) {
            owner = new Signer(event.params.walletAddress.toHex() + event.params.ownerAddress.toHex());
            owner.address = event.params.ownerAddress;
            owner.weight = BigInt.fromString("1");
            owner.txnCap = BigInt.fromString("-1");
            let ipfsData = ipfs.cat(event.params.ownerCid.toString());
            if (ipfsData) {
                let jsonData = json.fromBytes(ipfsData);
                let object = jsonData.toObject();
                if (object) {
                    let signerMetadata = new SignerMetadata(
                        event.params.walletAddress.toHex() + event.params.ownerAddress.toHex()
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
                    owner.metadata = event.params.walletAddress.toHex() + event.params.ownerAddress.toHex();
                }
            }
            owner.save();
            let tempSigners = wallet.signers;
            tempSigners.push(event.params.walletAddress.toHex() + event.params.ownerAddress.toHex());
            wallet.signers = tempSigners;
            wallet.owner = event.params.walletAddress.toHex() + event.params.ownerAddress.toHex();
        }
        wallet.save();
    }
}
