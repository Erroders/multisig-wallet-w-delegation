/* eslint-disable @next/next/no-img-element */
import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import makeBlockie from "ethereum-blockies-base64";
import { Transaction } from "../utils/types";
import { ethers } from "ethers";
import { approveTransaction } from "../controllers/TransactionController";
import { useSignerContext } from "../contexts/Signer";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

type Props = {
    txn: Transaction;
};

const TransactionCard = ({ txn }: Props) => {
    const timeAgo = new TimeAgo("en-US");
    const { signer } = useSignerContext();
    return signer ? (
        <div
            className={`group flex items-center justify-between rounded p-5 ${
                txn.executed ? "bg-emerald-100" : "bg-yellow-100"
            }`}
        >
            <div className="flex flex-col justify-between space-y-3 px-10">
                <p className="flex justify-between space-x-5">
                    <span className="font-mono text-xs font-semibold">
                        #{txn.id}
                    </span>
                    <div className="flex flex-col">
                        <span className="font-mono font-semibold">
                            {txn.to}
                        </span>
                        <p className="font-mono font-semibold">
                            {ethers.utils.formatUnits(txn.amount)}
                            <span className="text-xs"> MATIC</span>
                        </p>
                    </div>
                </p>
            </div>
            <span className="text-xs">
                {timeAgo.format(new Date(Number(txn.createdOn) * 1000))}
            </span>
            {txn.executed ? (
                <span className=" w-min rounded bg-emerald-500 p-1 text-xs opacity-0 group-hover:opacity-100">
                    executed
                </span>
            ) : signer.delegateTo ? (
                <span className=" w-min rounded bg-yellow-500 p-1 text-xs opacity-0 group-hover:opacity-100">
                    delegated
                </span>
            ) : (
                <button
                    className="btn-dark w-min opacity-0 group-hover:opacity-100"
                    type="button"
                    onClick={() => {
                        if (signer) approveTransaction(signer.signer, txn.id);
                    }}
                >
                    Approve
                </button>
            )}
            <div className="flex flex-col items-end justify-center space-y-4">
                <div className="flex space-x-2">
                    {txn.approvedBy.map((signer_) => {
                        return (
                            <div
                                key={signer_.address}
                                className="h-8 w-8 cursor-pointer self-start overflow-hidden rounded"
                            >
                                <img
                                    src={makeBlockie(signer_.address)}
                                    alt="Approver blockie image"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    ) : (
        <></>
    );
};

export default TransactionCard;
