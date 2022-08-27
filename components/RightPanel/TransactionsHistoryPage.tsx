import { Wallet } from "../../utils/types";

interface TransactionsProps {
  wallet: Wallet;
}

const TransactionsHistoryPage = ({ wallet }: TransactionsProps) => {
  return (
    <section className="flex flex-col space-y-3 px-10 py-20">
      {/* TODO: Resolve this issue */}
      <p>Transaction History</p>
      {/* {wallet.transactions.map((transaction) => {
        return <TransactionCard key={transaction.id} txn={transaction} />;
      })} */}
    </section>
  );
};

export default TransactionsHistoryPage;
