/* eslint-disable @next/next/no-img-element */
import { ERC1155Token, ERC721Token } from "../../utils/types";

interface NFTCardProps {
    data: ERC721Token | ERC1155Token;
}

const NFTCard = ({ data }: NFTCardProps) => {
    return (
        <div>
            <div
                className="group cursor-pointer rounded-lg bg-gray-300 shadow"
                role="NFT Card">
                <div className="flex w-full justify-center overflow-hidden rounded-md object-contain">
                    <img
                        className="h-full w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
                        src={data.url ? data.url : "/img_not_found.png"}
                        alt={data.contractName}
                    />
                </div>

                <div className="flex flex-col justify-center space-y-0.5 px-2 py-4">
                    <div className="flex justify-between">
                        {data.nftName && (
                            <p className="text-sm font-medium">
                                {data.nftName.length > 20
                                    ? data.nftName.substring(0, 20) + "..."
                                    : data.nftName}
                            </p>
                        )}
                        <p className="text-sm font-medium">
                            #
                            {data.tokenId.toString().length > 5
                                ? data.tokenId.toString().substring(0, 5) +
                                  "..."
                                : data.tokenId.toString()}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <p className="text-lg font-bold">
                            {data.contractName.length > 20
                                ? data.contractName.substring(0, 20) + "..."
                                : data.contractName}
                        </p>
                        {data.contractTickerSymbol && (
                            <p className="text-lg text-gray-500">
                                ({data.contractTickerSymbol})
                            </p>
                        )}
                    </div>
                    <p className="font-mono text-sm font-medium italic">
                        {data.contractAddr.substring(0, 10) +
                            "....." +
                            data.contractAddr.substring(33)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NFTCard;
