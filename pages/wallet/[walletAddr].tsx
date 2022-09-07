import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DropDown from "../../components/DropDown";
import LeftPane from "../../components/LeftPane";
import RightPane from "../../components/RightPane";
import RightPanel from "../../components/RightPanel";
import SignerProfile from "../../components/SignerProfile";
import { useSignerContext } from "../../contexts/Signer";
import { delegate, revokeDelegation } from "../../controllers/SignerController";
import { fetchSigner, fetchWallet } from "../../utils/fetchData";
import { Signer, Wallet } from "../../utils/types";

type Props = {};

const WalletPage = (props: Props) => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [user, setUser] = useState<Signer | null>(null);
    const [delegate_, setDelegate] = useState<string>("");
    const router = useRouter();
    const { signer } = useSignerContext();

    useEffect(() => {
        const { walletAddr } = router.query;
        console.log(walletAddr);

        const fetchUser_ = async () => {
            if (signer && signer.signer) {
                const userData = await fetchSigner(
                    walletAddr as string,
                    signer.signer
                );
                setUser(userData);
            }
        };
        const fetchWallet_ = async () => {
            await fetchWallet(walletAddr as string).then((wallet_) => {
                setWallet(wallet_);
            });
        };
        fetchUser_();
        fetchWallet_();
    }, [signer]);

    return (
        <div>
            <Head>
                <title>{wallet ? wallet.metadata.title : ""}</title>
                <meta
                    name="description"
                    content={wallet ? wallet.metadata.description : ""}
                />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <main className="grid grid-cols-6">
                <LeftPane>
                    <SignerProfile signer={user} />
                    {user && wallet && signer && (
                        <form
                            action=""
                            className="mt-28 w-full"
                            onSubmit={
                                user.delegateTo
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
                            {user.delegateTo ? (
                                <div className="flex w-full items-center justify-center space-x-5">
                                    <span>
                                        Delegated to&nbsp;
                                        <span className="font-bold">
                                            {"0x" +
                                                user.delegateTo.split("0x")[2]}
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
                                                        ? signer_.metadata
                                                              .name +
                                                          "(" +
                                                          signer_.metadata.walletAddress.substring(
                                                              0,
                                                              15
                                                          ) +
                                                          "..."
                                                        : "",
                                                    attribute: signer_.address,
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
                                            Delegate
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
