/* eslint-disable @next/next/no-img-element */
import makeBlockie from "ethereum-blockies-base64";
import { ethers } from "ethers";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTooltip from "react-tooltip";
import { useSignerContext } from "../contexts/Signer";
import { approveERC20Transaction } from "../controllers/ERC20TransactionController";
import { ERC20Transaction } from "../utils/types";

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

interface ERC20TransactionCardProps {
  txn: ERC20Transaction;
  walletAddr: string;
}

const ERC20TransactionCard = ({
  txn,
  walletAddr,
}: ERC20TransactionCardProps) => {
  const timeAgo = new TimeAgo("en-US");
  const { signer } = useSignerContext();
  return signer ? (
    <div
      className={`group flex items-center justify-between rounded p-5 ${
        txn.txnStatus == "EXECUTED" ? "bg-emerald-100" : "bg-yellow-100"
      }`}
    >
      <div className="flex flex-col justify-between space-y-3 px-10">
        <p className="flex justify-between space-x-5">
          <span className="font-mono text-xs font-semibold">#{txn.id}</span>
          <div className="flex flex-col">
            <span className="font-mono font-semibold">{txn.to}</span>
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

      {txn.txnStatus == "EXECUTED" ? (
        <span className="btn-green px-4 py-2.5 opacity-0 hover:scale-100 group-hover:opacity-100">
          Executed
        </span>
      ) : signer.delegateTo ? (
        <span className=" w-min rounded bg-yellow-500 p-1 text-xs opacity-0 group-hover:opacity-100">
          Delegated
        </span>
      ) : (
        <div className="flex gap-4">
          <button
            className="btn-dark w-min opacity-0 group-hover:opacity-100"
            type="button"
            onClick={() => {
              if (signer)
                approveERC20Transaction(signer.signer, walletAddr, txn.id);
            }}
          >
            Approve
          </button>

          <button
            className="btn-red w-min opacity-0 group-hover:opacity-100"
            type="button"
            onClick={() => {
              //   if (signer) approveTransaction(signer.signer, txn.id);
            }}
          >
            Decline
          </button>
        </div>
      )}
      <div className="flex flex-col items-end justify-center space-y-4">
        <div className="flex space-x-2">
          {txn.approvedBy.map((signer_: any) => {
            return (
              <>
                {" "}
                <div
                  key={signer_.address}
                  className="h-8 w-8 cursor-pointer self-start overflow-hidden rounded"
                >
                  <img
                    src={makeBlockie(signer_.address)}
                    alt="Approver blockie image"
                    data-tip={signer_.address}
                  />
                </div>
              </>
            );
          })}
        </div>
      </div>
      <ReactTooltip place="bottom" type="dark" effect="solid" />
    </div>
  ) : (
    <></>
  );
};

export default ERC20TransactionCard;
