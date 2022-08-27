import { ethers } from "ethers";
import MultisigWallet from "../subgraph/abis/MultisigWallet.json";

export async function createERC20Transaction(
    signer: ethers.Signer | null,
    walletAddr: string,
    contractAddr: string,
    to: string,
    amount: number
) {
    if (signer) {
        const contract = new ethers.Contract(
            walletAddr,
            MultisigWallet.abi,
            signer
        );
        const amount_ = ethers.utils.parseUnits(amount.toString(), "ether");
        try {
            const txn = await contract.createERC20Transaction(to, contractAddr, amount_);
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function approveERC20Transaction(
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
            const txn = await contract.approveERC20Transaction(Number(txnId));
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function disapproveERC20Transaction(
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
            const txn = await contract.disapproveERC20Transaction(Number(txnId));
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}
