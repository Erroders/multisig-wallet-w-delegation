import type { NextPage } from "next";
import Head from "next/head";
import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";

const Home: NextPage = () => {
    return (
        <div>
            <Head>
                <title>Multisig Wallet with Delegation</title>
                <meta name="description" content="" />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <main className="grid grid-cols-6">
                <LeftPane />
                <RightPane />
            </main>

            <footer></footer>
        </div>
    );
};

export default Home;
