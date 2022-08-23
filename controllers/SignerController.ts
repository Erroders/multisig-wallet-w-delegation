import { ethers } from "ethers";
import { NFTStorage, Blob } from "nft.storage";
import { Signer, SignerMetadata } from "../utils/types";
import MultisigWallet from "./../subgraph/abis/MultisigWallet.json";

const address = "0xD5F80a6C0431305c354FCC338627F4b492434Bf3";

async function uploadToIpfs(metadata: SignerMetadata) {
    const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || "",
    });
    const cid = await client.storeBlob(new Blob([JSON.stringify(metadata)]));
    console.log(cid);
    return cid;
}

export async function addSigner(
    signer: ethers.Signer | null,
    signerData: Signer
) {
    if (signer) {
        const contract = new ethers.Contract(
            address,
            MultisigWallet.abi,
            signer
        );
        const cid = await uploadToIpfs(signerData.metadata);
        console.log(cid, signerData);
        try {
            const txn = await contract.addSigner(signerData.address, cid);
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function delegate(signer: ethers.Signer | null, to: string) {
    if (signer) {
        const contract = new ethers.Contract(
            address,
            MultisigWallet.abi,
            signer
        );
        try {
            const txn = await contract.delegate(to);
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function revokeDelegation(signer: ethers.Signer | null) {
    if (signer) {
        const contract = new ethers.Contract(
            address,
            MultisigWallet.abi,
            signer
        );
        try {
            const txn = await contract.revokeDelegation();
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}
