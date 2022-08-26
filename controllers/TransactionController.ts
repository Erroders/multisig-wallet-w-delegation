import { ethers } from "ethers";
import MultisigWallet from "./../subgraph/abis/MultisigWallet.json";

const address = "0xD5F80a6C0431305c354FCC338627F4b492434Bf3";

export async function createTransaction(
    signer: ethers.Signer | null,
    to: string,
    amount: number
) {
    if (signer) {
        const contract = new ethers.Contract(
            address,
            MultisigWallet.abi,
            signer
        );
        const amount_ = ethers.utils.parseUnits(amount.toString(), "ether");
        try {
            const txn = await contract.createTransaction(to, amount_);
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function approveTransaction(
    signer: ethers.Signer | null,
    txnId: string
) {
    if (signer) {
        const contract = new ethers.Contract(
            address,
            MultisigWallet.abi,
            signer
        );
        try {
            const txn = await contract.approveTransaction(Number(txnId));
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function deposit(signer: ethers.Signer | null, value: string) {
    if (signer) {
        const contract = new ethers.Contract(
            address,
            MultisigWallet.abi,
            signer
        );
        try {
            value = ethers.utils
                .parseUnits(value.toString(), "ether")
                .toString();
            const txn = await contract.deposit({ value: value });
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}
