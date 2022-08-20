import { ethers } from "ethers";
import { NFTStorage, Blob } from "nft.storage";
import { Signer, SignerMetadata } from "../utils/types";
import MultisigWallet from "./../subgraph/abis/MultisigWallet.json";

const address = "0xc7934c07a05cce68f25d48375da68063ae99c06c";

async function uploadToIpfs(metadata: SignerMetadata) {
    const ipfsAPI = process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY;
    if (ipfsAPI) {
        const client = new NFTStorage({
            token: ipfsAPI,
        });
        const cid = await client.storeBlob(
            new Blob([JSON.stringify(metadata)])
        );
        return cid;
    }
}

export async function addSigner(signer: ethers.Signer, signerData: Signer) {
    const contract = new ethers.Contract(address, MultisigWallet.abi, signer);

    const signerData_: SignerMetadata = {
        name: signerData.metadata.name,
        contactNo: signerData.metadata.contactNo,
        email: signerData.metadata.email,
        walletAddress: signerData.metadata.walletAddress,
        role: signerData.metadata.role,
        remarks: signerData.metadata.remarks,
    };
    const cid = await uploadToIpfs(signerData_);

    try {
        const txn = await contract.addSigner(signerData.address, cid);
        const txnStatus = await txn.wait();
        console.log(txnStatus);
    } catch (error) {
        console.error(error);
    }
}

export async function delegate(signer: ethers.Signer, to: string) {
    const contract = new ethers.Contract(address, MultisigWallet.abi, signer);
    try {
        const txn = await contract.delegate(to);
        const txnStatus = await txn.wait();
        console.log(txnStatus);
    } catch (error) {
        console.error(error);
    }
}

export async function revokeDelegation(signer: ethers.Signer) {
    const contract = new ethers.Contract(address, MultisigWallet.abi, signer);
    try {
        const txn = await contract.revokeDelegation();
        const txnStatus = await txn.wait();
        console.log(txnStatus);
    } catch (error) {
        console.error(error);
    }
}
