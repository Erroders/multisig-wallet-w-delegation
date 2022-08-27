import { ethers } from "ethers";
import MultisigWallet from "../subgraph/abis/MultisigWallet.json";

export async function createERC1155Transaction(
    signer: ethers.Signer | null,
    walletAddr: string,
    contractAddr: string,
    to: string,
    tokenId: number,
    amount: number
) {
    if (signer) {
        const contract = new ethers.Contract(
            walletAddr,
            MultisigWallet.abi,
            signer
        );
        try {
            const txn = await contract.createERC1155Transaction(to, contractAddr, tokenId, amount);
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function approveERC1155Transaction(
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
            const txn = await contract.approveERC1155Transaction(Number(txnId));
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function disapproveERC1155Transaction(
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
            const txn = await contract.disapproveERC1155Transaction(Number(txnId));
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}
