/* eslint-disable @next/next/no-img-element */
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useState } from "react";
import { useSignerContext } from "../contexts/Signer";
import { Signer, Wallet } from "../utils/types";
import AddSignerPage from "./RightPanel/AddSignerPage";
import CryptoPage from "./RightPanel/CryptoPage";
import NFTPage from "./RightPanel/NFTPage";
import TopSectionPage from "./RightPanel/TopSectionPage";
import TransactionsHistoryPage from "./RightPanel/TransactionsHistoryPage";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

type Props = { wallet: Wallet; user: Signer | null };

enum rightPanelSectionOptions {
    CRYPTO = 0,
    NFTS = 1,
    TRANSACTION_HISTORY = 2,
}

const RightPane = ({ wallet, user }: Props) => {
    const [typeOfToken, setTypeOfToken] = useState(0);
    const [showAddSignerBox, setShowAddSignerBox] = useState(false);
    const [rightPanelSection, setRightPanelSection] =
        useState<rightPanelSectionOptions>(rightPanelSectionOptions.CRYPTO);

    const { signer } = useSignerContext();
    return signer ? (
        <>
            <TopSectionPage
                setShowAddSignerBox={setShowAddSignerBox}
                setTypeOfToken={setTypeOfToken}
                showAddSignerBox={showAddSignerBox}
                signer={signer}
                typeOfToken={typeOfToken}
                wallet={wallet}
            />

            <AddSignerPage
                setShowAddSignerBox={setShowAddSignerBox}
                showAddSignerBox={showAddSignerBox}
                signer={signer}
                wallet={wallet}
            />
            <div className={showAddSignerBox ? " hidden " : ""}>
                <ul className="mx-28 my-10 mb-2 flex overflow-hidden rounded-lg bg-gray-300 text-center">
                    <li className="flex-1">
                        <div
                            className={
                                "relative block cursor-pointer rounded-xl p-4 text-sm font-medium" +
                                (rightPanelSection ===
                                rightPanelSectionOptions.CRYPTO
                                    ? " bg-purple-600 text-white "
                                    : " bg-transparent ")
                            }
                            onClick={() => {
                                setRightPanelSection(
                                    rightPanelSectionOptions.CRYPTO
                                );
                            }}>
                            Crypto
                        </div>
                    </li>

                    <li className="flex-1 pl-px">
                        <div
                            className={
                                "relative block cursor-pointer rounded-lg  p-4 text-sm font-medium" +
                                (rightPanelSection ===
                                rightPanelSectionOptions.NFTS
                                    ? " bg-purple-600 text-white "
                                    : " bg-transparent ")
                            }
                            onClick={() => {
                                setRightPanelSection(
                                    rightPanelSectionOptions.NFTS
                                );
                            }}>
                            NFTs
                        </div>
                    </li>

                    <li className="flex-1 pl-px">
                        <div
                            className={
                                "relative block cursor-pointer rounded-lg  p-4 text-sm font-medium" +
                                (rightPanelSection ===
                                rightPanelSectionOptions.TRANSACTION_HISTORY
                                    ? " bg-purple-600 text-white "
                                    : " bg-transparent ")
                            }
                            onClick={() => {
                                setRightPanelSection(
                                    rightPanelSectionOptions.TRANSACTION_HISTORY
                                );
                            }}>
                            Transaction History
                        </div>
                    </li>
                </ul>

                {rightPanelSection === rightPanelSectionOptions.CRYPTO && (
                    <CryptoPage signer={signer} wallet={wallet} />
                )}
                {rightPanelSection === rightPanelSectionOptions.NFTS && (
                    <NFTPage signer={signer} wallet={wallet} />
                )}
                {rightPanelSection ===
                    rightPanelSectionOptions.TRANSACTION_HISTORY && (
                    <TransactionsHistoryPage
                        signer={signer}
                        wallet={wallet}
                        user={user}
                    />
                )}
            </div>
        </>
    ) : (
        <></>
    );
};

export default RightPane;
