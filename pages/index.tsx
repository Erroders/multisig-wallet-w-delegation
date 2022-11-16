import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";
import { useSignerContext } from "../contexts/Signer";
import { Wallet, WalletMetadata, SignerMetadata } from "../utils/types";
import { fetchWallets } from "../utils/fetchData";
import SignerProfile from "../components/SignerProfile";
import WalletCard from "../components/WalletCard";
import { createWallet } from "../controllers/WalletController";

const Home: NextPage = () => {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [toggleAdd, setToggleAdd] = useState(false);
    const { signer } = useSignerContext();

    useEffect(() => {
        if (signer)
            fetchWallets(signer).then((wallets_) => {
                setWallets(wallets_);
            });
    }, [signer]);

    async function handleSubmit(event: any) {
        event.preventDefault();
        const walletMetadata: WalletMetadata = {
            title: event.target.walletTitle.value,
            description: event.target.walletDesc.value,
        };

        const ownerMetadata: SignerMetadata = {
            name: event.target.ownerName.value,
            contactNo: event.target.ownerContactNo.value,
            email: event.target.ownerEmail.value,
            walletAddress: event.target.ownerWalletAddr.value,
            role: event.target.ownerRole.value,
            remarks: event.target.ownerRemarks.value,
        };

        console.log(ownerMetadata, walletMetadata);

        if (signer) {
            await createWallet(signer.signer, walletMetadata, ownerMetadata);
            setToggleAdd(false);
        }
    }
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
                </LeftPane>
                <RightPane>
                    <div className="relative h-full w-full">
                        {toggleAdd ? (
                            <div className="relative mx-auto max-w-screen-xl p-4 sm:px-6 lg:px-8">
                                <p
                                    className="top-10 right-10 w-full cursor-pointer text-right font-mono text-3xl"
                                    onClick={() => {
                                        setToggleAdd((state) => !state);
                                    }}>
                                    x
                                </p>
                                <form
                                    action="submit"
                                    className="mx-auto mb-0 max-w-md space-y-4"
                                    onSubmit={handleSubmit}>
                                    <div className="mx-auto max-w-lg text-center">
                                        <h1 className="text-2xl font-bold">
                                            Add Wallet Details
                                        </h1>
                                    </div>
                                    <input
                                        type="text"
                                        name="walletTitle"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter Wallet Title"
                                        required
                                    />
                                    <textarea
                                        rows={4}
                                        name="walletDesc"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter Wallet Description"
                                    />

                                    <div className="mx-auto max-w-lg text-center">
                                        <h1 className="text-2xl font-bold">
                                            Add Owner Details
                                        </h1>
                                    </div>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter Owner Name"
                                        required
                                    />
                                    <input
                                        type="email"
                                        name="ownerEmail"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter Owner E-mail"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="ownerContactNo"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter Owner Contact No"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="ownerWalletAddr"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter Owner Wallet Address"
                                        required
                                    />
                                    <input
                                        type="text"
                                        name="ownerRole"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter Owner Role"
                                        required
                                    />
                                    <textarea
                                        rows={3}
                                        name="ownerRemarks"
                                        className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                                        placeholder="Enter Remarks"
                                    />

                                    <div className="flex w-full items-center justify-center">
                                        <button
                                            type="submit"
                                            className="inline-block w-full rounded bg-blue-500 px-5 py-3  font-semibold text-white">
                                            Create Wallet
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <>
                                {wallets.length >= 0 ? (
                                    <div className="grid grid-cols-2 gap-5 p-10">
                                        {wallets.map((wallet_) => {
                                            return (
                                                <WalletCard
                                                    key={
                                                        wallet_.contractAddress
                                                    }
                                                    wallet={wallet_}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <button
                                    className="absolute bottom-10 right-10 z-10 flex items-center justify-center rounded-full border-2 border-gray-900 bg-emerald-500 px-4 py-2 text-green-700 shadow-md transition-all hover:scale-110 focus:outline-none"
                                    type="button"
                                    onClick={() => {
                                        setToggleAdd((state) => !state);
                                    }}>
                                    <span className="font-mono text-2xl font-medium text-gray-900">
                                        +
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </RightPane>
            </main>

            <footer></footer>
        </div>
    );
};

export default Home;
