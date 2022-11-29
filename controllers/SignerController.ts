import { ethers } from "ethers";
import ERC20ABI from "../utils/ERC20ABI.json";
import { Signer } from "../utils/types";
import { uploadToIpfs } from "../utils/uploadToIPFS";
import MultisigWallet from "./../subgraph/abis/MultisigWallet.json";

export async function addSigner(
    signer: ethers.Signer | null,
    walletAddress: string,
    signerData: Signer
) {
    if (signer && signerData.metadata) {
        const contract = new ethers.Contract(
            walletAddress,
            MultisigWallet.abi,
            signer
        );
        const cid = await uploadToIpfs(signerData.metadata);
        try {
            const txn = await contract.addSigner(
                signerData.address,
                signerData.txnCap == -1
                    ? signerData.txnCap
                    : ethers.utils.parseUnits(
                          signerData.txnCap!.toString(),
                          "ether"
                      ),
                cid
            );
            const txnStatus = await txn.wait();
            console.log(txnStatus);
        } catch (error) {
            console.error(error);
        }
    }
}

export async function delegate(
    signer: ethers.Signer | null,
    walletAddress: string,
    to: string
) {
    console.log(signer, walletAddress, to);
    if (signer) {
        const contract = new ethers.Contract(
            walletAddress,
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

export async function revokeDelegation(
    signer: ethers.Signer | null,
    walletAddress: string
) {
    if (signer) {
        const contract = new ethers.Contract(
            walletAddress,
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

export default async function deposit(
    signer: ethers.Signer,
    contract: string,
    amount: string,
    walletAddress: string
) {
    try {
        if (contract == "native") {
            let tx = {
                to: walletAddress,
                value: ethers.utils.parseEther(amount),
            };
            const tx_status = await (await signer.sendTransaction(tx)).wait();
            console.log(tx_status);
            return;
        }
        const ERC20Contract = new ethers.Contract(contract, ERC20ABI, signer);
        const tx = await ERC20Contract.connect(signer).transfer(
            walletAddress,
            ethers.utils.parseUnits(amount)
        );
        const tx_status = await tx.wait();
        console.log(tx_status);
    } catch (error) {
        console.log(error);
    }
}
