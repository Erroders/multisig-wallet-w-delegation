import { ethers } from "ethers";

export type Signer = {
    address: string;
    weight: number;
    delegateTo: string;
    metadata: SignerMetadata;
    signer: ethers.Signer;
};

export type SignerMetadata = {
    name: string;
    contactNo: number;
    email: string;
    walletAddress: string;
    role: string;
    remarks: string;
};

export type Transaction = {
    id: string;
    to: string;
    amount: number;
    approval: number;
    executed: boolean;
    approvedBy: Signer[];
    createdOn: string;
};

export type Wallet = {
    contractAddress: string;
    owner: Signer;
    signers: Signer[];
    transactions: Transaction[];
    createdOn: string;
    balance: string;
    lockedBalance: string;
};