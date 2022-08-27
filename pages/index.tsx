import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";
import { useSignerContext } from "../contexts/Signer";
import { Wallet } from "../utils/types";
import SignerProfile from "../components/SignerProfile";
import DropDown from "../components/DropDown";
import { revokeDelegation, delegate } from "../controllers/SignerController";

const Home: NextPage = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const { signer } = useSignerContext();
    useEffect(() => {
        fetchWallets(signer).then((wallets_) => {
            setWallets(wallets_);
        });
    }, [signer]);

    return (
        <div>
            <Head>
                <title>Multisig Wallet with Delegation</title>
                <meta name="description" content="" />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <main className="grid grid-cols-6">
                <LeftPane>
                    <SignerProfile signer={signer} />
                    {signer && (
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
                                        menuOptions={signers
                                            .filter((signer_) => {
                                                return (
                                                    signer.address !=
                                                    signer_.address
                                                );
                                            })
                                            .map((signer_) => {
                                                return {
                                                    item: signer_.metadata.name,
                                                    attribute: signer_,
                                                };
                                            })}
                                        defaultSelected={0}
                                        setState={setDelegate}
                                    />
                                    <button
                                        type="submit"
                                        className="btn-green w-2/5"
                                    >
                                        <span className="font-medium">
                                            {" "}
                                            Delegate{" "}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </LeftPane>
                <RightPane>{wallets.length > 0 ? <></> : <></>}</RightPane>
            </main>

            <footer></footer>
        </div>
    );
};

export default Home;
