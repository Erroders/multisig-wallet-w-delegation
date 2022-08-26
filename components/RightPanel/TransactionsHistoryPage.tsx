import { Wallet } from "../../utils/types";
import TransactionCard from "../TransactionCard";

interface TransactionsProps {
  showAddSignerBox: boolean;
  wallet: Wallet;
}

const TransactionsHistoryPage = ({
  showAddSignerBox,
  wallet,
}: TransactionsProps) => {
  return (
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
  );
};

export default TransactionsHistoryPage;
