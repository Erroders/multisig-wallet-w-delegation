import { useEffect, useState } from "react";
import {
    ERC1155Transaction,
    ERC20Transaction,
    ERC721Transaction,
    Signer,
    Wallet,
} from "../../utils/types";
import ERC20TransactionCard from "../TransactionCard";

interface TransactionsProps {
    signer: Signer | null;
    wallet: Wallet;
    user: Signer | null;
}

const TransactionsHistoryPage = ({
    signer,
    wallet,
    user,
}: TransactionsProps) => {
    const [chainId, setChainId] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Array<{
        type: "ERC20Transaction" | "ERC721Transaction" | "ERC1155Transaction";
        data: ERC20Transaction | ERC721Transaction | ERC1155Transaction;
    }> | null>(null);
    console.log(wallet);
    useEffect(() => {
        signer?.signer?.getChainId().then((v) => {
            setChainId(v);
        });
    }, []);

    useEffect(() => {
        let tempArr: Array<{
            type:
                | "ERC20Transaction"
                | "ERC721Transaction"
                | "ERC1155Transaction";
            data: ERC20Transaction | ERC721Transaction | ERC1155Transaction;
        }> = [];

        wallet.erc20Transactions &&
            wallet.erc20Transactions.forEach((value) => {
                tempArr.push({
                    type: "ERC20Transaction",
                    data: value,
                });
            });

        // wallet.erc721Transactions &&
        //     wallet.erc721Transactions.forEach((value) => {
        //         tempArr.push({
        //             type: "ERC721Transaction",
        //             data: value,
        //         });
        //     });

        // wallet.erc1155Transactions &&
        //     wallet.erc1155Transactions.forEach((value) => {
        //         tempArr.push({
        //             type: "ERC1155Transaction",
        //             data: value,
        //         });
        //     });

        setTransactions(tempArr);
        console.log(tempArr);
    }, [chainId]);

    return (
        <section className="flex flex-col space-y-3 px-28 py-10">
            {transactions == null || transactions.length == 0 ? (
                <div className="col-span-4">
                    <p className="text-center text-lg">No Transactions Found</p>
                </div>
            ) : (
                transactions.map((transaction) => {
                    if (transaction.type == "ERC20Transaction") {
                        let token = wallet.erc20tokens.filter((erc20token) => {
                            return (
                                erc20token.contractAddr ==
                                transaction.data.contractAddr
                            );
                        });
                        let approved = Boolean(
                            transaction.data.approvedBy.find((addr: any) => {
                                return (
                                    signer?.address.toLowerCase() ===
                                    addr.address
                                );
                            })
                        );
                        let disapproved = Boolean(
                            transaction.data.disapprovedBy.find((addr: any) => {
                                return (
                                    signer?.address.toLowerCase() ===
                                    addr.address
                                );
                            })
                        );
                        return (
                            <ERC20TransactionCard
                                key={transaction.data.txnId}
                                txn={transaction.data as ERC20Transaction}
                                walletAddr={wallet.contractAddress}
                                user={user}
                                tokenName={token[0].contractTickerSymbol}
                                approved={approved}
                                disapproved={disapproved}
                            />
                        );
                    }
                })
            )}
        </section>
    );
};

export default TransactionsHistoryPage;
