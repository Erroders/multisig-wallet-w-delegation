/* eslint-disable @next/next/no-img-element */
import makeBlockie from "ethereum-blockies-base64";
import { useEffect, useState } from "react";
import { getUdName } from "../utils/getUdAddress";
import { Signer } from "../utils/types";

type Props = { signer: Signer | null };

const SignerProfile = ({ signer }: Props) => {
    const [signerAddress, setSignerAddress] = useState(signer?.address);

    useEffect(() => {
        signer &&
            getUdName(signer.address).then((v) => {
                setSignerAddress(v);
            });
    }, [signer]);

    return signer ? (
        <div className="flex h-max flex-col items-center justify-center">
            <div
                className="h-32 w-32 cursor-pointer overflow-hidden rounded"
                onClick={() => {
                    navigator.clipboard.writeText(signer.address);
                }}>
                <img
                    src={makeBlockie(signer.address)}
                    alt="Signer Blockie Image"
                />
            </div>
            <span className="mt-3 mb-5 font-mono text-sm font-semibold text-white">
                {signerAddress}
            </span>
            <span className="text-2xl font-semibold tracking-wider">
                {signer.metadata?.name}
            </span>
            <span className="mt-2">{signer.metadata?.role}</span>
            {signer.metadata?.remarks && (
                <p className="mt-5 mb-2 flex max-w-sm gap-1 pb-2 text-gray-200">
                    <span className="h-min transform self-start text-4xl transition-transform delay-200 group-hover:-translate-y-2">
                        “
                    </span>
                    <span className="my-1 rounded-xl text-center">
                        {signer.metadata.remarks}
                    </span>
                    <span className="h-min transform self-end align-bottom text-4xl transition-transform delay-200 group-hover:-translate-y-2">
                        ”
                    </span>
                </p>
            )}
        </div>
    ) : (
        <></>
    );
};

export default SignerProfile;
