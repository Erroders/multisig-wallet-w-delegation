/* eslint-disable @next/next/no-img-element */
import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import makeBlockie from "ethereum-blockies-base64";
import { Transaction } from "../utils/types";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

type Props = {
    txn: Transaction;
};

const TransactionCard = ({ txn }: Props) => {
    const timeAgo = new TimeAgo("en-US");
    return (
        <div
            className={`group flex items-center justify-between rounded p-5 ${
                txn.executed ? "bg-emerald-100" : "bg-yellow-100"
            }`}
        >
            <div className="flex flex-col justify-between space-y-3 px-10">
                <p className="flex justify-between space-x-5">
                    <span className="font-mono text-xs font-semibold">#2</span>
                    <div className="flex flex-col">
                        <span className="font-mono font-semibold">
                            {txn.to}
                        </span>
                        <p className="font-mono font-semibold">
                            {txn.amount}
                            <span className="text-xs"> ETH</span>
                        </p>
                    </div>
                </p>
            </div>
            <span className="text-xs">
                {timeAgo.format(new Date(txn.createdOn))}
            </span>
            <button className="btn-dark w-min opacity-0 group-hover:opacity-100">
                Approve
            </button>
            <div className="flex flex-col items-end justify-center space-y-4">
                <div className="flex space-x-2">
                    {txn.approvedBy.map((signer) => {
                        return (
                            <div
                                key={signer.address}
                                className="h-8 w-8 cursor-pointer self-start overflow-hidden rounded"
                            >
                                <img
                                    src={makeBlockie(signer.address)}
                                    alt="Approver blockie image"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
