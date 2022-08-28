import { useState } from "react";
import Modal from "react-modal";
import { createERC20Transaction } from "../../controllers/ERC20TransactionController";
import { ERC20Token, Signer, Wallet } from "../../utils/types";

interface CryptoCardProps {
  signer: Signer | null;
  data: ERC20Token;
  wallet: Wallet;
}

const CryptoCard = ({ data, signer, wallet }: CryptoCardProps) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#e5e7eb",
    },
  };

  function openModal() {
    setModalIsOpen(true);
  }

  function closeModal() {
    setModalIsOpen(false);
  }

  return (
    <div>
      <div className="group rounded-lg bg-gray-300 p-6" role="NFT Card">
        <div className="flex w-full justify-center overflow-hidden rounded-md object-contain">
          <img
            className="h-full w-full transition-transform duration-300 ease-in-out"
            src={data.logoUrl ? data.logoUrl : "/img_not_found.png"}
            alt={data.contractName}
          />
        </div>

        <div className="px-2 pt-2 pb-4">
          <div className="mb-2 flex justify-between">
            <h5 className="inline-block text-xl font-bold">
              {data.contractName}
            </h5>
            <p className="my-auto inline-block text-gray-500">
              {data.contractTickerSymbol}
            </p>
          </div>

          <p className="my-auto inline-block text-gray-500">
            Balance: {data.balance}
          </p>
          <p className="my-auto inline-block text-gray-500">
            Locked Balance: {data.lockedBalance}
          </p>
        </div>

        <button
          className="btn-dark w-full "
          disabled={data.balance <= 0}
          // onClick={openModal}
        >
          Transfer
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <div className="min-w-[24rem]">
          <div className="mb-4 flex justify-between">
            <h2 className="my-auto inline-block text-xl font-semibold">
              Transfer Tokens
            </h2>
            <button className="btn-dark" onClick={closeModal}>
              x
            </button>
          </div>

          <form
            className="flex h-full flex-col items-center justify-center"
            onSubmit={async (e: any) => {
              e.preventDefault();

              if (signer) {
                await createERC20Transaction(
                  signer.signer,
                  wallet.contractAddress,
                  data.contractAddr,
                  e.target.to.value,
                  e.target.amount.value
                );
              }
            }}
          >
            <input
              type="text"
              id="to"
              className="input my-2 border-gray-800"
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
      </Modal>
    </div>
  );
};

export default CryptoCard;
