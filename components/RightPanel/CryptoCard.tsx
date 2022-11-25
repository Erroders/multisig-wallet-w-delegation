import makeBlockie from "ethereum-blockies-base64";
import { ethers } from "ethers";
import { useState } from "react";
import Modal from "react-modal";
import { createERC20Transaction } from "../../controllers/ERC20TransactionController";
import { ERC20Token, Signer, Wallet } from "../../utils/types";

interface CryptoCardProps {
    signer: Signer | null;
    data: ERC20Token;
    wallet: Wallet;
    user: Signer | null;
}

const CryptoCard = ({ data, signer, wallet, user }: CryptoCardProps) => {
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
                <div className="flex justify-center overflow-hidden rounded-md object-contain">
                    <img
                        className="h-20 w-20 rounded-full p-2 transition-transform duration-300 ease-in-out"
                        src={data.logoUrl}
                        alt={data.contractName}
                        onError={(target) => {
                            target.currentTarget.onerror = null;
                            const blockie = makeBlockie(data.contractAddr);
                            target.currentTarget.src = blockie;
                        }}
                    />
                </div>

                <div className="px-2 pt-2 pb-4">
                    <div className="mb-2 flex flex-row items-baseline justify-between">
                        <h5 className="text-base font-bold">
                            {data.contractName.substring(0, 7) + "..."}
                        </h5>
                        <p className="text-sm text-gray-500">
                            {data.contractTickerSymbol}
                        </p>
                    </div>

                    <p className="py-0.5 text-sm text-gray-600">
                        Balance: {ethers.utils.formatUnits(data.balance)}
                    </p>
                    <p className="text-sm text-gray-600">
                        Locked Balance:{" "}
                        {ethers.utils.formatUnits(data.lockedBalance)}
                    </p>
                </div>

                {user && !user?.delegateTo && (
                    <button
                        className="btn-dark w-full "
                        disabled={data.balance <= 0}
                        onClick={openModal}>
                        Transfer
                    </button>
                )}
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                style={customStyles}>
                <div className="min-w-[28rem] p-5">
                    <div className="mb-4 flex justify-between">
                        <h2 className="my-auto inline-block text-xl font-bold">
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
                                console.log(
                                    signer.signer,
                                    wallet.contractAddress,
                                    data.contractAddr,
                                    e.target.to.value,
                                    e.target.amount.value
                                );
                                await createERC20Transaction(
                                    signer.signer,
                                    wallet.contractAddress,
                                    data.contractAddr,
                                    e.target.to.value,
                                    e.target.amount.value
                                );
                                closeModal();
                            }
                        }}>
                        <input
                            type="text"
                            id="to"
                            required
                            className="input my-2 border-gray-800"
                            placeholder="Address"
                        />

                        <input
                            type="text"
                            required
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
