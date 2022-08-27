import { NFTStorage } from "nft.storage";
import { SignerMetadata, WalletMetadata } from "./types";

export async function uploadToIpfs(metadata: SignerMetadata | WalletMetadata) {
    const client = new NFTStorage({
        token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || "",
    });
    const cid = await client.storeBlob(new Blob([JSON.stringify(metadata)]));
    console.log(cid);
    return cid;
}