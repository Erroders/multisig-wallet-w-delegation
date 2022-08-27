import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import SignerContext from "../contexts/Signer";
import { connect } from "../utils/connectWallet";
import { Signer } from "../utils/types";
import { ethers } from "ethers";

function MyApp({ Component, pageProps }: AppProps) {
    const [signer, setSigner] = useState<Signer | null>(null);

    const handleUpdateSigner = async (
        signer_: ethers.Signer | null
    ): Promise<void> => {
        if (signer_) {
            const address = await signer_.getAddress();
            setSigner({ address: address, signer: signer_ });
        } else {
            setSigner(null);
        }
    };

    useEffect(() => {
        const _connect = async () => {
            const _signer = await connect(handleUpdateSigner);
            if (_signer) {
                handleUpdateSigner(_signer);
            } else {
                setSigner(null);
            }
        };
        _connect();
    }, []);

    return (
        <SignerContext.Provider value={{ signer, handleUpdateSigner }}>
            <Component {...pageProps} />
        </SignerContext.Provider>
    );
}

export default MyApp;
