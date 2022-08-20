import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import SignerContext from "../contexts/Signer";
import { connect } from "../utils/connectWallet";
import { Signer } from "../utils/types";
import { ethers } from "ethers";

function MyApp({ Component, pageProps }: AppProps) {
    const [signer, setSigner] = useState<Signer | null>(null);
    const handleUpdateSigner = async (signer: Signer | null) => {
        setSigner(signer);
    };
    useEffect(() => {
        connect(async (etherSigner: ethers.Signer | null) => {});
    }, []);

    return (
        <SignerContext.Provider value={{ signer, handleUpdateSigner }}>
            <Component {...pageProps} />
        </SignerContext.Provider>
    );
}

export default MyApp;
