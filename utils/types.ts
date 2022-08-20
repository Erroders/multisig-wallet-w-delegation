export type Signer = {
    cid: string;
    delegate: string;
    weight: number;
    address: string;
}

export type SignerMetadata = {
    name: string;
    contactNo: number;
    email:string;
    addressWallet : string;
    role:string;
    remarks:string;
}

export type transaction = {
    from: string;
    to: string;
    amount: number;
    approvedBy: Signer[]
}
