import React from "react";
import { Signer, SignerMetadata } from "../utils/types";
import { addSigner } from "../controllers/SignerController";
import { useSignerContext } from "../contexts/Signer";
import WalletPage from "../components/RightPanel/WalletPage";
import HeaderWalletPage from "../components/RightPanel/HeaderWalletPage";
// import Navbar from "../components/navbar";
// import Header from "./Header";

type Props = {};

const AddSigner = (props: Props) => {
    const { signer } = useSignerContext();

    return (
        <>
        <HeaderWalletPage/>
            <WalletPage/>
        </>
    );
};

export default AddSigner;
