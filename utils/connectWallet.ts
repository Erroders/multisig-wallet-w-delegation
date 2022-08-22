import type { IUAuthOptions } from "@uauth/web3modal";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import UAuthSPA from "@uauth/js";
import * as UAuthWeb3Modal from "./ud_web3modal";

export const uauthOptions: IUAuthOptions = {
    clientID: "21ddb151-da3b-4762-8604-a50c786d7b82",
    redirectUri: "https://multisigwallet-w-delegation.vercel.app/",
    scope: "openid wallet",
};

const providerOptions = {
    "custom-uauth": {
        display: UAuthWeb3Modal.display,
        connector: UAuthWeb3Modal.connector,
        package: UAuthSPA,
        options: uauthOptions,
    },
};

export async function connect(
    cb: (etherSigner: ethers.Signer | null) => Promise<void>
) {
    const web3Modal = new Web3Modal({ providerOptions });
    UAuthWeb3Modal.registerWeb3Modal(web3Modal);

    try {
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection, "any");

        // Subscribe to accounts change
        connection.on("accountsChanged", async (accounts: string[]) => {
            console.log(accounts);
            if (accounts.length > 0) {
                const signer = provider.getSigner();
                await cb(signer);
            }
        });

        // Subscribe to chainId change
        connection.on("chainChanged", async (chainId: number) => {
            console.log(chainId);
            const signer = provider.getSigner();
            await cb(signer);
        });

        // Subscribe to provider connection
        connection.on("connect", async (info: { chainId: number }) => {
            console.log(info);
            const signer = provider.getSigner();
            await cb(signer);
        });

        // Subscribe to provider disconnection
        connection.on(
            "disconnect",
            async (error: { code: number; message: string }) => {
                console.log(error);
            }
        );
        return provider.getSigner();
    } catch (error) {
        console.log(error);
    }
    return null;
}
