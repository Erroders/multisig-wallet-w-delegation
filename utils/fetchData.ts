import axios from "axios";
import { CryptoType } from "./types";

export async function getCryptofromAddress(
  chainId: number,
  address: string
): Promise<Array<CryptoType>> {
  const endPoint = process.env.NEXT_PUBLIC_COVALENT_ENDPOINT || "";
  const apiKey = process.env.NEXT_PUBLIC_COVALENT_APIKEY || "";

  const axiosRawData = await axios.get(
    endPoint + chainId + "/address/" + address + "/balances_v2/?key=" + apiKey
  );

  const data = axiosRawData.data.data.items.filter(
    (item: any) => item.type == "cryptocurrency" || item.type == "stablecoin"
  );

  return data as CryptoType[];
}

export async function getNftsfromAddress(
  chainId: number,
  address: string
): Promise<Array<CryptoType>> {
  const endPoint = process.env.NEXT_PUBLIC_COVALENT_ENDPOINT || "";
  const apiKey = process.env.NEXT_PUBLIC_COVALENT_APIKEY || "";

  const axiosRawData = await axios.get(
    endPoint + chainId + "/address/" + address + "/balances_v2/?key=" + apiKey
  );

  const data = axiosRawData.data.data.items.filter(
    (item: any) => item.type == "nft"
  );

  return data as CryptoType[];
}
