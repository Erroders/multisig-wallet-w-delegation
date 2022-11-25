/* eslint-disable @next/next/no-img-element */
import makeBlockie from "ethereum-blockies-base64";
import { ethers } from "ethers";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTooltip from "react-tooltip";
import { useSignerContext } from "../contexts/Signer";
import {
    approveERC20Transaction,
    disapproveERC20Transaction,
} from "../controllers/ERC20TransactionController";
import { ERC20Transaction, Signer } from "../utils/types";

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

interface ERC20TransactionCardProps {
    txn: ERC20Transaction;
    walletAddr: string;
    user: Signer | null;
    tokenName: string;
}

const ERC20TransactionCard = ({
    txn,
    walletAddr,
    user,
    tokenName,
}: ERC20TransactionCardProps) => {
    const timeAgo = new TimeAgo("en-US");
    const { signer } = useSignerContext();
    return signer ? (
        <div
            className={`group flex items-center justify-start rounded p-5 ${
                txn.txnStatus == "EXECUTED" ? "bg-emerald-100" : "bg-yellow-100"
            }`}>
            <div className="flex w-min items-center space-x-4 pr-2">
                <span className="min-w-max px-2 font-mono text-sm font-medium">
                    # {txn.txnId}
                </span>
                <div className="flex min-w-min flex-col">
                    <span className="font-mono font-semibold">{txn.to}</span>
                    <p className="font-mono font-semibold">
                        {ethers.utils.formatUnits(txn.amount)}
                        <span className="text-sm font-medium">
                            {" "}
                            {tokenName}
                        </span>
                    </p>
                </div>
            </div>
            <span className="min-w-max px-4 text-sm">
                {timeAgo.format(new Date(Number(txn.createdOn) * 1000))}
            </span>

            {(() => {
                if (txn.txnStatus == "EXECUTED")
                    return (
                        <div className="flex w-full justify-center">
                            <span className="btn-green w-min px-6 py-2.5 opacity-0 hover:scale-100 group-hover:opacity-100">
                                Executed
                            </span>
                        </div>
                    );
                else if (txn.txnStatus == "CANCELLED")
                    return (
                        <div className="flex w-full justify-center">
                            <span className="btn-red w-min px-6 py-2.5 opacity-0 hover:scale-100 group-hover:opacity-100">
                                Cancelled
                            </span>
                        </div>
                    );
                else {
                    if (user && user.delegateTo)
                        return (
                            <div className="flex w-full justify-center">
                                <span className="btn-yellow w-min px-6 py-2.5 opacity-0 hover:scale-100 group-hover:opacity-100">
                                    Delegated
                                </span>
                            </div>
                        );
                    else
                        return (
                            <div className="flex w-full justify-center gap-2 px-3">
                                <button
                                    className="btn-dark min-w-max opacity-0 group-hover:opacity-100"
                                    type="button"
                                    onClick={() => {
                                        console.log(signer);
                                        if (signer)
                                            approveERC20Transaction(
                                                signer.signer,
                                                walletAddr,
                                                txn.txnId
                                            );
                                    }}>
                                    Approve
                                </button>

                                <button
                                    className="btn-red min-w-max opacity-0 group-hover:opacity-100"
                                    type="button"
                                    onClick={() => {
                                        if (signer)
                                            disapproveERC20Transaction(
                                                signer.signer,
                                                walletAddr,
                                                txn.txnId
                                            );
                                    }}>
                                    Decline
                                </button>
                            </div>
                        );
                }
            })()}
            <div className="flex min-w-max max-w-full items-center justify-center space-x-2 overflow-auto px-4">
                {txn.approvedBy.map((signer_: any) => {
                    return (
                        <div
                            key={signer_.address}
                            className="h-8 w-8 cursor-pointer overflow-hidden rounded">
                            <img
                                src={makeBlockie(signer_.address)}
                                alt="Approver blockie image"
                                data-tip={signer_.address}
                            />
                        </div>
                    );
                })}
            </div>
            <ReactTooltip place="top" type="dark" effect="solid" />
        </div>
    ) : (
        <></>
    );
};

export default ERC20TransactionCard;
