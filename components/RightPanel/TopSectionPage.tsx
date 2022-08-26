import makeBlockie from "ethereum-blockies-base64";
import { ethers } from "ethers";
import TimeAgo from "javascript-time-ago";
import { SetStateAction } from "react";
import {
  createTransaction,
  deposit,
} from "../../controllers/TransactionController";
import { Signer, Wallet } from "../../utils/types";

interface TopSectionPageProps {
  wallet: Wallet;
  signer: Signer | null;
  showAddSignerBox: boolean;
  setShowAddSignerBox: (value: SetStateAction<boolean>) => void;
  typeOfToken: number;
  setTypeOfToken: (value: SetStateAction<number>) => void;
}

const TopSectionPage = ({
  wallet,
  signer,
  setShowAddSignerBox,
  showAddSignerBox,
  typeOfToken,
  setTypeOfToken,
}: TopSectionPageProps) => {
  const timeAgo = new TimeAgo("en-US");

  return (
    <section className="sticky top-0 z-20 grid h-72 grid-cols-5 bg-purple-800 px-10 text-white">
      <div className="col-span-3 my-auto">
        <div className="flex items-center justify-center space-x-10">
          <div
            className="h-20 w-20 self-start overflow-hidden rounded"
            onClick={() => {
              // handleUpdateSigner(null);
            }}
          >
            <img
              src={makeBlockie(
                wallet.contractAddress ? wallet.contractAddress : "raghav.eth"
              )}
              alt="Wallet Contract Blockie Image"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm">Multisig Wallet Contract</span>
            <span className="font-mono text-lg font-bold">
              {wallet.contractAddress}
            </span>
            <span className="text-xs">
              Created {timeAgo.format(new Date())}
              {/* {timeAgo.format(new Date(wallet.createdOn))} */}
            </span>
            <div className="mt-8 flex items-center justify-between space-x-16">
              <div className="flex flex-col items-center">
                <p className="font-mono text-lg font-semibold tracking-tighter">
                  {ethers.utils.formatUnits(wallet.balance)} MATIC
                </p>
                <p className="text-xs">Balance</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="font-mono text-lg font-semibold tracking-tighter">
                  {ethers.utils.formatUnits(wallet.lockedBalance)} MATIC
                </p>
                <p className="text-xs">Locked Balance</p>
              </div>
              <div className="flex flex-col items-center tracking-tighter">
                <p className="font-mono text-lg font-semibold">
                  {wallet.signers.length}
                </p>
                <p className="text-xs">Signers</p>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-start space-x-8">
              {signer && (
                <button
                  className="btn-blue"
                  onClick={() => {
                    signer && deposit(signer.signer, "0.5");
                  }}
                >
                  Deposit
                </button>
              )}
              {signer && !showAddSignerBox && (
                <button
                  className="btn-blue"
                  onClick={() => {
                    setShowAddSignerBox(true);
                  }}
                >
                  Add Signer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-2 my-auto px-20">
        <ul className="mb-2 flex overflow-hidden rounded-lg bg-purple-700 text-center">
          <li className="flex-1">
            <div
              className={
                "relative block cursor-pointer rounded-xl p-4 text-sm font-medium" +
                (typeOfToken === 0 ? " bg-purple-900 " : " bg-transparent ")
              }
              onClick={() => {
                setTypeOfToken(0);
              }}
            >
              Crypto
            </div>
          </li>

          <li className="flex-1 pl-px">
            <div
              className={
                "relative block cursor-pointer rounded-lg  p-4 text-sm font-medium" +
                (typeOfToken === 1 ? " bg-purple-900 " : " bg-transparent ")
              }
              onClick={() => {
                setTypeOfToken(1);
              }}
            >
              NFTs
            </div>
          </li>
        </ul>

        <form
          className="flex h-full flex-col items-center justify-center"
          onSubmit={(e: any) => {
            e.preventDefault();
            if (signer) {
              if (typeOfToken === 0) {
                createTransaction(
                  signer.signer,
                  e.target.to.value,
                  e.target.amount.value
                );
              }
            }
          }}
        >
          <input
            type="text"
            id="to"
            className="input my-2"
            placeholder="Address"
          />

          <input
            type="text"
            id="amount"
            className="input my-2"
            placeholder="Amount"
          />

          <button className="btn-green mt-5 w-full" type="submit">
            Create Transaction
          </button>
        </form>
      </div>
    </section>
  );
};

export default TopSectionPage;
