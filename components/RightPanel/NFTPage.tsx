import { useEffect, useState } from "react";
import { ERC1155Token, ERC721Token, Signer, Wallet } from "../../utils/types";
import NFTCard from "./NFTCard";

interface NFTPageProps {
    signer: Signer | null;
    wallet: Wallet;
}

const NFTPage = ({ signer, wallet }: NFTPageProps) => {
    const [chainId, setChainId] = useState<number | null>(null);
    const [nftData, setNftData] = useState<Array<
        ERC721Token | ERC1155Token
    > | null>(null);

    useEffect(() => {
        signer?.signer?.getChainId().then((v) => {
            setChainId(v);
        });
    }, []);

    useEffect(() => {
        let temp: Array<ERC721Token | ERC1155Token> = wallet.erc721tokens;
        temp.concat(wallet.erc1155tokens);

        setNftData(temp);
    }, [chainId]);

    return (
        <section className="flex flex-col space-y-3 px-28 py-10">
            <div className="grid grid-cols-3 gap-6">
                {nftData == null || nftData.length == 0 ? (
                    <div className="col-span-4">
                        <p className="text-center text-lg">No NFTs Found</p>
                    </div>
                ) : (
                    nftData.map((tokenData) => {
                        return (
                            <NFTCard
                                data={tokenData}
                                key={tokenData.contractAddr}
                            />
                        );
                    })
                )}
            </div>
        </section>
    );
};

export default NFTPage;
