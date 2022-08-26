import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import SignerContext from "../contexts/Signer";
import { connect } from "../utils/connectWallet";
import { Signer } from "../utils/types";
import { ethers } from "ethers";
import { executeQuery } from "../utils/apolloClient";

function MyApp({ Component, pageProps }: AppProps) {
    const [signer, setSigner] = useState<Signer | null>(null);
    const handleUpdateSigner = async (signer: ethers.Signer | null) => {
        if (signer) {
            const address = await signer.getAddress();
            console.log(address);
            const data = await executeQuery(`query{
                signer(id: "${address.toLowerCase()}"){
                  address
                  weight
                  delegateTo{
                    address
                  }
                  metadata{
                    name
                    contactNo
                    email
                    role
                    remarks
                    walletAddress
                  }
                }
              }`);
            console.log(data);
            if(data.signer){
                const signer_: Signer = {
                    address: data.signer.address,
                    weight: data.signer.weight,
                    delegateTo: data.signer.delegateTo
                        ? data.signer.delegateTo.address
                        : null,
                    metadata: {
                        name: data.signer.metadata.name,
                        contactNo: data.signer.metadata.contactNo,
                        email: data.signer.metadata.email,
                        walletAddress: data.signer.metadata.walletAddress,
                        role: data.signer.metadata.role,
                        remarks: data.signer.metadata.remarks,
                    },
                    signer: signer,
                };
                console.log(signer_);
                setSigner(signer_);
            }else{
                setSigner(null);
            }
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
