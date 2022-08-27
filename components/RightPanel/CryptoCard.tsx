import { CryptoType } from "../../utils/types";

interface CryptoCardProps {
  data: CryptoType;
}

const CryptoCard = ({ data }: CryptoCardProps) => {
  return (
    <div>
      <div
        className="group cursor-pointer rounded-lg bg-gray-300 p-6 hover:scale-105"
        role="NFT Card"
      >
        <div className="flex w-full justify-center overflow-hidden rounded-md object-contain">
          <img
            className="h-full w-full transition-transform duration-300 ease-in-out group-hover:scale-110"
            src={data.logo_url ? data.logo_url : "/img_not_found.png"}
            alt={data.contract_name}
          />
        </div>

        <div className="px-2 pt-2 pb-4">
          <h5 className="text-xl font-bold">{data.contract_name}</h5>
          <p className="mt-2 text-gray-500">{data.contract_ticker_symbol}</p>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
