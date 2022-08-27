import { ethers } from "ethers";

export type Signer = {
    address: string;
    weight: number;
    delegateTo: string;
    metadata: SignerMetadata;
    txnCap: number,
    signer: ethers.Signer | null;
};

export type SignerMetadata = {
    name: string;
    contactNo: string;
    email: string;
    walletAddress: string;
    role: string;
    remarks: string;
};

export type WalletMetadata = {
    title: string;
    description: string;
};

export type ERC20Transaction =  {
    to: string;
    contractAddr: string;
    amount: number;
    approval: number;
    disapproval: number;
    txnStatus: string;
    approvedBy: Signer[]
    disapprovedBy: Signer[]
    createdOn: string;
}

export type ERC721Transaction = {
    to: string;
    contractAddr: string;
    tokenID: number;
    approval: number;
    disapproval: number;
    txnStatus: string;
    approvedBy: Signer[]
    disapprovedBy: Signer[]
    createdOn: string;
}

export type ERC1155Transaction = {
    to: string;
    contractAddr: string;
    tokenID: number;
    amount: number;
    approval: number;
    disapproval: number;
    txnStatus: string;
    approvedBy: Signer[]
    disapprovedBy: Signer[]
    createdOn: string;
}

export type Wallet = {
    contractAddress: string;
    owner: Signer;
    signers: Signer[];
    erc20Transactions: ERC20Transaction[]
    erc721Transactions: ERC721Transaction[]
    erc1155Transactions: ERC1155Transaction[]
    createdOn: string;
    metadata: WalletMetadata;
    erc20tokens: ERC20Token[];
    erc721tokens: ERC721Token[];
    erc1155tokens: ERC1155Token[];
};

export type ERC20Token = {
    balance: number;
    lockedBalance: number;
    contractName: string;
    contractTickerSymbol: string;
    contractAddr: string;
    logoUrl: string;
    decimals: number;
    quoteRate: number;
}

export type ERC721Token = {
    contractName: string;
    contractAddr: string;
    contractTickerSymbol: string;
    nftName: string;
    description: string;
    url: string;
    tokenId: number;
    locked: boolean;
}

export type ERC1155Token = {
    contractName: string;
    contractAddr: string;
    contractTickerSymbol: string;
    nftName: string;
    description: string;
    tokenBalance: number;
    url: string;
    tokenId: number;
    lockedBalance: number;
}