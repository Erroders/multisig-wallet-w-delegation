import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { ethers } from "ethers";
import { Signer } from "../utils/types";

const SignerContext = createContext<{
    signer: Signer | null;
    handleUpdateSigner: (signer_: ethers.Signer | null) => Promise<void>;
}>({
    signer: null,
    handleUpdateSigner: async () => {},
});

export function useSignerContext() {
    return useContext(SignerContext);
}

export default SignerContext;
