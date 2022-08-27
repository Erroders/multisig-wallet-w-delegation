import { useEffect, useState } from "react";
import { getCryptofromAddress } from "../../utils/fetchData";
import { CryptoType, Signer, Wallet } from "../../utils/types";
import CryptoCard from "./CryptoCard";

interface CryptoPageProps {
  signer: Signer | null;
  wallet: Wallet;
}

const CryptoPage = ({ signer, wallet }: CryptoPageProps) => {
  const [chainId, setChainId] = useState<number | null>(null);
  const [crytoData, setCrytoData] = useState<CryptoType[] | null>(null);

  useEffect(() => {
    signer?.signer?.getChainId().then((v) => {
      setChainId(v);
    });
  }, []);

  useEffect(() => {
    chainId &&
      signer &&
      getCryptofromAddress(chainId, signer?.address).then((data) => {
        setCrytoData(data);
      });
  }, [chainId]);

  return (
    <section className="flex flex-col space-y-3 px-28 py-10">
      <div className="grid grid-cols-6">
        {crytoData?.map((tokenData) => {
          return (
            <>
              {/* {JSON.stringify(tokenData, null, 4)} */}

              <CryptoCard data={tokenData} key={tokenData.contract_address} />
            </>
          );
        })}
      </div>
    </section>
  );
};

export default CryptoPage;
