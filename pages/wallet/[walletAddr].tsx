import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LeftPane from "../../components/LeftPane";
import RightPane from "../../components/RightPane";
import SignerProfile from "../../components/SignerProfile";
import { useSignerContext } from "../../contexts/Signer";
import { Wallet } from "../../utils/types";

type Props = {};

const WalletPage = (props: Props) => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const router = useRouter();
    const { signer } = useSignerContext();
    useEffect(() => {
        const { walletAddr } = router.query;
        fetchWallet(walletAddr).then((wallet_) => {
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
                </LeftPane>
                <RightPane>{wallet ? <></> : <></>}</RightPane>
            </main>

            <footer></footer>
        </div>
    );
};

export default WalletPage;
