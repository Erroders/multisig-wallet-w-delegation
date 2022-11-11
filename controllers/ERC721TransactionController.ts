import { ethers } from "ethers";
import MultisigWallet from "../subgraph/abis/MultisigWallet.json";

export async function createERC721Transaction(
    signer: ethers.Signer | null,
    walletAddr: string,
    contractAddr: string,
    to: string,
    tokenId: number
) {
    if (signer) {
        const contract = new ethers.Contract(
            walletAddr,
            MultisigWallet.abi,
            signer
        );
        try {
            const txn = await contract.createERC721Transaction(to, contractAddr, tokenId);
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function approveERC721Transaction(
    signer: ethers.Signer | null,
    walletAddr: string,
    txnId: string
) {
    if (signer) {
        const contract = new ethers.Contract(
            walletAddr,
            MultisigWallet.abi,
            signer
        );
        try {
            const txn = await contract.approveERC721Transaction(Number(txnId));
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function disapproveERC721Transaction(
    signer: ethers.Signer | null,
    walletAddr: string,
    txnId: string
) {
    if (signer) {
        const contract = new ethers.Contract(
            walletAddr,
            MultisigWallet.abi,
            signer
        );
        try {
            const txn = await contract.disapproveERC721Transaction(Number(txnId));
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}
