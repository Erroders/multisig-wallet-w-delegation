// import { NFTStorage } from "nft.storage";
import { create } from "ipfs-http-client";
import { SignerMetadata, WalletMetadata } from "./types";

export async function uploadToIpfs(metadata: SignerMetadata | WalletMetadata) {
    // const client = new NFTStorage({
    //     token: process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY || "",
    // });
    // const cid = await client.storeBlob(new Blob([JSON.stringify(metadata)]));
    // console.log(cid);
    // return cid;

    // https://www.npmjs.com/package/ipfs-http-client
    const ipfs = await create({
        url: "https://api.thegraph.com/ipfs/api/v0/",
    });
    const { path } = await ipfs.add(new Blob([JSON.stringify(metadata)]));
    console.log(path);
    return path;
}
