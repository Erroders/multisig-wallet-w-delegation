/* eslint-disable @next/next/no-img-element */
import makeBlockie from "ethereum-blockies-base64";
import { ethers } from "ethers";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useState } from "react";
import { useSignerContext } from "../contexts/Signer";
import { addSigner } from "../controllers/SignerController";
import {
  createTransaction,
  deposit,
} from "../controllers/TransactionController";
import { Signer, SignerMetadata, Wallet } from "../utils/types";
import TransactionCard from "./TransactionCard";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

type Props = { wallet: Wallet };

const RightPane = ({ wallet }: Props) => {
  const [typeOfToken, setTypeOfToken] = useState(0);
  const [showAddSignerBox, setShowAddSignerBox] = useState(true);

  const timeAgo = new TimeAgo("en-US");
  const { signer } = useSignerContext();
  return (
    <div className="col-span-4 bg-gray-100">
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

      <section
        className={
          "flex flex-col space-y-3 bg-gray-100 px-10 py-10" +
          (showAddSignerBox ? "" : " hidden ")
        }
      >
        <div className="flex justify-between">
          <h2 className="my-auto  text-xl font-semibold">Add Signer</h2>

          <button
            className="btn-dark"
            onClick={() => {
              setShowAddSignerBox(false);
            }}
          >
            <span className="mr-2">x</span> Close
          </button>
        </div>

        <form
          action=""
          className="space-y-4"
          onSubmit={(e: any) => {
            e.preventDefault();
            const data: SignerMetadata = {
              name: e.target.name.value,
              contactNo: e.target.number.value,
              email: e.target.email.value,
              walletAddress: e.target.walletAddress.value,
              role: e.target.role.value,
              remarks: e.target.remarks.value,
            };
            const signerData: Signer = {
              address: e.target.walletAddress.value,
              weight: 0,
              delegateTo: "",
              metadata: data as SignerMetadata,
              signer: null,
            };

            addSigner(signer!.signer, signerData);
          }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>

              <div className="relative mt-1">
                <input
                  type="text"
                  id="name"
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                  placeholder="Enter Name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="number" className="text-sm font-medium">
                Number
              </label>

              <div className="relative mt-1">
                <input
                  type="tel"
                  id="number"
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                  placeholder="Enter Number"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="text-sm font-medium">
              Wallet Address
            </label>

            <div className="relative mt-1">
              <input
                type="text"
                id="walletAddress"
                className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                placeholder="Enter Wallet Address"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>

              <div className="relative mt-1">
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                  placeholder="Enter email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="Role" className="text-sm font-medium">
                Role
              </label>

              <div className="relative mt-1">
                <input
                  type="text"
                  id="role"
                  className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-md"
                  placeholder="Enter Role"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium " htmlFor="remarks">
              Message
            </label>
            <textarea
              className="w-full rounded-lg border-gray-200 p-3 text-sm shadow-md"
              placeholder="Remarks"
              rows={8}
              id="remarks"
            ></textarea>
          </div>

          <button
            type="submit"
            className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            Add Signer
          </button>
        </form>
      </section>

      <section
        className={
          "flex flex-col space-y-3 px-10 py-20" +
          (showAddSignerBox ? " hidden " : "")
        }
      >
        {wallet.transactions.map((transaction) => {
          return <TransactionCard key={transaction.id} txn={transaction} />;
        })}
      </section>
    </div>
  );
};

export default RightPane;
