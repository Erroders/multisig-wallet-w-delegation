/* eslint-disable @next/next/no-img-element */
import makeBlockie from "ethereum-blockies-base64";
import React from "react";
import { Wallet } from "../utils/types";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useRouter } from "next/router";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);
type Props = { wallet: Wallet };

const WalletCard = ({ wallet }: Props) => {
    const timeAgo = new TimeAgo("en-US");
    const router = useRouter();
    return (
        <div
            className="relative block cursor-pointer rounded border bg-blue-100 py-5 px-10"
            onClick={() => {
                router.push(`/wallet/${wallet.contractAddress}`);
            }}
        >
            <div className="flex w-full justify-between">
                <div
                    className="h-20 w-20 cursor-pointer overflow-hidden rounded"
                    onClick={() => {
                        navigator.clipboard.writeText(wallet.contractAddress);
                    }}
                >
                    <img
                        src={makeBlockie(wallet.contractAddress)}
                        alt="Signer Blockie Image"
                    />
                </div>
                <div className="flex flex-col space-y-1 text-right">
                    <span className="font-mono text-sm font-semibold italic">
                        {wallet.contractAddress}
                    </span>
                    <span className="text-xs">
                        {timeAgo.format(
                            new Date(Number(wallet.createdOn) * 1000)
                        )}
                    </span>
                </div>
            </div>

            <h5 className="mt-4 text-xl font-bold text-gray-900">
                {wallet.metadata.title}
            </h5>

            <p className="mt-2 hidden text-sm sm:block">
                {wallet.metadata.description}
            </p>
        </div>
    );
};

export default WalletCard;
