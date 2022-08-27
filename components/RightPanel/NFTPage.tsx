import { useEffect, useState } from "react";
import { getNftsfromAddress } from "../../utils/fetchData";
import { CryptoType, Signer, Wallet } from "../../utils/types";

interface NFTPageProps {
  signer: Signer | null;
  wallet: Wallet;
}

const NFTPage = ({ signer, wallet }: NFTPageProps) => {
  const [chainId, setChainId] = useState<number | null>(null);
  const [nftData, setNftData] = useState<CryptoType[] | null>(null);

  useEffect(() => {
    signer?.signer?.getChainId().then((v) => {
      setChainId(v);
    });
  }, []);

  useEffect(() => {
    chainId &&
      signer &&
      getNftsfromAddress(chainId, signer?.address).then((data) => {
        setNftData(data);
      });
  }, [chainId]);
  return <div>NFTPage</div>;
};

export default NFTPage;
