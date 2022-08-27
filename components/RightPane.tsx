/* eslint-disable @next/next/no-img-element */
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useState } from "react";
import { useSignerContext } from "../contexts/Signer";
import { Wallet } from "../utils/types";
import AddSignerPage from "./RightPanel/AddSignerPage";
import TopSectionPage from "./RightPanel/TopSectionPage";
import TransactionsHistoryPage from "./RightPanel/TransactionsHistoryPage";
TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

type Props = { wallet: Wallet };

const RightPane = ({ wallet }: Props) => {
  const [typeOfToken, setTypeOfToken] = useState(0);
  const [showAddSignerBox, setShowAddSignerBox] = useState(true);

  const { signer } = useSignerContext();
  return signer ? (
    <div className="col-span-4 bg-gray-100">
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
      />

      <TransactionsHistoryPage
        showAddSignerBox={showAddSignerBox}
        wallet={wallet}
      />
    </div>
  ) : (
    <></>
  );
};

export default RightPane;
