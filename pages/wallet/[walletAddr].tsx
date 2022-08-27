import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import DropDown from "../../components/DropDown";
import LeftPane from "../../components/LeftPane";
import RightPane from "../../components/RightPane";
import RightPanel from "../../components/RightPanel";
import SignerProfile from "../../components/SignerProfile";
import { useSignerContext } from "../../contexts/Signer";
import { delegate, revokeDelegation } from "../../controllers/SignerController";
import { fetchWallet } from "../../utils/fetchData";
import { Wallet } from "../../utils/types";

type Props = {};

const WalletPage = (props: Props) => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [delegate_, setDelegate] = useState<string>("");
    const router = useRouter();
    const { signer } = useSignerContext();
    useEffect(() => {
        const { walletAddr } = router.query;
        console.log(walletAddr);
        fetchWallet(walletAddr as string).then((wallet_) => {
            console.log(wallet_);
            setWallet(wallet_);
        });
    }, []);

    return (
        <div>
            <Head>
                <title>{wallet ? wallet.contractAddress : ""}</title>
                <meta
                    name="description"
                    content={wallet ? wallet.metadata.description : ""}
                />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <main className="grid grid-cols-6">
                <LeftPane>
                    <SignerProfile signer={signer} />
                    {signer && wallet && (
                        <form
                            action=""
                            className="mt-28 w-full"
                            onSubmit={
                                signer.delegateTo
                                    ? (e) => {
                                          e.preventDefault();
                                          revokeDelegation(
                                              signer.signer,
                                              wallet.contractAddress
                                          );
                                      }
                                    : (e) => {
                                          e.preventDefault();
                                          if (delegate_)
                                              delegate(
                                                  signer.signer,
                                                  wallet.contractAddress,
                                                  delegate_
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
                                        menuOptions={wallet.signers
                                            .filter((signer_) => {
                                                return (
                                                    signer.address !=
                                                    signer_.address
                                                );
                                            })
                                            .map((signer_) => {
                                                return {
                                                    item: signer_.metadata
                                                        ? signer_.metadata.name
                                                        : "",
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
                <RightPane>
                    {wallet ? <RightPanel wallet={wallet} /> : <></>}
                </RightPane>
            </main>

            <footer></footer>
        </div>
    );
};

export default WalletPage;
