import {ethers} from "ethers";
import MultisigWallet from "./../subgraph/abis/MultisigWallet.json";

const address = "0xc7934c07a05cce68f25d48375da68063ae99c06c";

export async function createTransaction(signer:ethers.Signer, to: string, amount:number){
    const contract = new ethers.Contract(address, MultisigWallet.abi, signer);
    const amount_ = ethers.utils.parseUnits(amount.toString(), "ether")
    try{
        const txn = await contract.createTransaction(to, amount_)
        const txnStatus = await txn.wait();
        console.log(txnStatus)
    }catch (error) {
        console.error(error);
    }
}

export async function approveTransaction(signer:ethers.Signer, txnId:number){
    const contract = new ethers.Contract(address, MultisigWallet.abi, signer);
    try{
        const txn = await contract.approveTransaction(txnId)
        const txnStatus = await txn.wait();
        console.log(txnStatus)
    }catch (error) {
        console.error(error);
    }
}