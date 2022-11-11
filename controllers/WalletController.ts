import { ethers } from "ethers";
import { SignerMetadata, WalletMetadata } from "../utils/types";
import WalletCreator from "./../subgraph/abis/WalletCreator.json";
import { uploadToIpfs } from "../utils/uploadToIPFS";
import network from "../subgraph/networks.json";

// const creatorWalletAddress = "0x3ebB1A1D4d23e7bB65960b6EcC2E1048F61b4Ffd";
const creatorWalletAddress = network.mumbai.WalletCreator.address;

export async function createWallet(
    signer: ethers.Signer | null,
    walletData: WalletMetadata,
    ownerData: SignerMetadata
) {
    if (signer) {
        const contract = new ethers.Contract(
            creatorWalletAddress,
            WalletCreator.abi,
            signer
        );
        const walletCid = await uploadToIpfs(walletData);
        const ownerCid = await uploadToIpfs(ownerData);
        try {
            const txn = await contract.createWallet(
                walletCid,
                ownerCid
            );
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}
