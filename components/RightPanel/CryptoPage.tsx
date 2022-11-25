import { useEffect, useState } from "react";

import { ERC20Token, Signer, Wallet } from "../../utils/types";
import CryptoCard from "./CryptoCard";

interface CryptoPageProps {
    signer: Signer | null;
    wallet: Wallet;
    user: Signer | null;
}

const CryptoPage = ({ signer, wallet, user }: CryptoPageProps) => {
    const [chainId, setChainId] = useState<number | null>(null);
    const [crytoData, setCrytoData] = useState<ERC20Token[] | null>(null);

    useEffect(() => {
        signer?.signer?.getChainId().then((v) => {
            setChainId(v);
        });
    }, []);

    useEffect(() => {
        setCrytoData(wallet.erc20tokens);
        console.log(wallet.erc20tokens);
    }, [chainId]);

    return (
        <section className="flex flex-col space-y-3 px-28 py-10">
            <div className="grid grid-cols-4 gap-6">
                {crytoData == null || crytoData?.length == 0 ? (
                    <div className="col-span-4">
                        <p className="text-center text-lg">No Crypto Found</p>
                    </div>
                ) : (
                    crytoData.map((tokenData) => {
                        return (
                            <CryptoCard
                                signer={signer}
                                data={tokenData}
                                key={tokenData.contractAddr}
                                wallet={wallet}
                                user={user}
                            />
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default CryptoPage;
