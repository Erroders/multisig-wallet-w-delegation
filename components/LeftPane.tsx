/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import makeBlockie from "ethereum-blockies-base64";
import DropDown from "./DropDown";
import { useSignerContext } from "../contexts/Signer";
import { delegate, revokeDelegation } from "../controllers/SignerController";
import { Signer } from "../utils/types";

type Props = { signers: Signer[] };

const LeftPane = ({ signers }: Props) => {
    const { signer } = useSignerContext();
    const [delegate_, setDelegate] = useState<Signer | null>(null);
    return signer ? (
        <div className="sticky top-0 col-span-2 h-screen bg-gray-900 px-10  py-20 text-white">
            <div className="flex h-full flex-col items-center justify-center">
                <div
                    className="h-32 w-32 cursor-pointer overflow-hidden rounded"
                    onClick={() => {
                        navigator.clipboard.writeText(signer.address);
                    }}
                >
                    <img
                        src={makeBlockie(signer.address)}
                        alt="Signer Blockie Image"
                    />
                </div>
                <span className="mt-3 mb-5 font-mono text-sm font-semibold text-white">
                    {signer.address}
                </span>
                <span className="text-2xl font-semibold tracking-wider">
                    {signer.metadata.name}
                </span>
                <span className="mt-2">{signer.metadata.role}</span>
                {/* <span className="mx-4 ">{signer.metadata.contactNo}</span>
                <span className="">{signer.metadata.email}</span> */}
                {signer.metadata.remarks && (
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
                <form
                    action=""
                    className="mt-28 w-full"
                    onSubmit={
                        signer.delegateTo
                            ? (e) => {
                                  e.preventDefault();
                                  revokeDelegation(signer.signer);
                              }
                            : (e) => {
                                  e.preventDefault();
                                  if (delegate_)
                                      delegate(
                                          signer.signer,
                                          delegate_.address
                                      );
                              }
                    }
                >
                    {signer.delegateTo ? (
                        <div className="flex w-full items-center justify-center space-x-5">
                            <span>
                                Delegated to&nbsp;
                                <span className="font-bold">
                                    {signer.delegateTo}
                                </span>
                            </span>
                            <button
                                type="submit"
                                className="btn-red w-2/5 font-medium"
                            >
                                Revoke Delegation
                            </button>
                        </div>
                    ) : (
                        <div className="flex w-full space-x-5">
                            <DropDown
                                menuOptions={signers.map((signer_) => {
                                    return {
                                        item: signer_.metadata.name,
                                        attribute: signer_,
                                    };
                                })}
                                defaultSelected={0}
                                setState={setDelegate}
                            />
                            <button type="submit" className="btn-green w-2/5">
                                <span className="font-medium"> Delegate </span>
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default LeftPane;
