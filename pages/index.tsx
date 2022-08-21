import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import LeftPane from "../components/LeftPane";
import RightPane from "../components/RightPane";
import { executeQuery } from "../utils/apolloClient";
import { Signer, Transaction, Wallet } from "../utils/types";
import { ethers } from "ethers";

const Home: NextPage = () => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    useEffect(() => {
        const getWalletData = async () => {
            let data = await executeQuery(`query{
                wallets{
                  id
                  lockedBalance
                  owner{
                    address
                  }
                  signers{
                    address
                    weight
                    delegateTo{
                        address
                    }
                    metadata{
                        name
                        contactNo
                        email
                        role
                        remarks
                        walletAddress
                    }
                  }
                  transactions{
                    id
                    to
                    amount
                    approval
                    executed
                    createdOn
                    approvedBy{
                      address
                    }
                  }
                }
              }`);
            data = data.wallets[0];
            console.log(data);
            const balance = await ethers
                .getDefaultProvider()
                .getBalance(data.id);
            const wallet_: Wallet = {
                contractAddress: data.id,
                owner: data.owner.address,
                signers: data.signers ? (data.signers as Signer[]) : [],
                transactions: data.transactions
                    ? (data.transactions as Transaction[])
                    : [],
                balance: balance.toString(),
                lockedBalance: data.lockedBalance,
            };
            console.log(wallet_);
            setWallet(wallet_);
        };
        getWalletData();
    }, []);

    return wallet ? (
        <div>
            <Head>
                <title>Multisig Wallet with Delegation</title>
                <meta name="description" content="" />
                {/* <link rel="icon" href="/favicon.ico" /> */}
            </Head>

            <main className="grid grid-cols-6">
                <LeftPane signers={wallet.signers} />
                <RightPane wallet={wallet} />
            </main>

            <footer></footer>
        </div>
    ) : (
        <></>
    );
};

export default Home;
