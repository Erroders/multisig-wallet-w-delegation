import { ethers } from "ethers";

export type Signer = {
  address: string;
  weight: number;
  delegateTo: string;
  metadata: SignerMetadata;
  txnCap: number;
  signer: ethers.Signer | null;
};

export type SignerMetadata = {
  name: string;
  contactNo: string;
  email: string;
  walletAddress: string;
  role: string;
  remarks: string;
};

export type ERC20Transaction = {
  to: string;
  contractAddr: string;
  amount: number;
  approval: number;
  disapproval: number;
  txnStatus: string;
  approvedBy: Signer[];
  disapprovedBy: Signer[];
  createdOn: string;
};

export type ERC721Transaction = {
  to: string;
  contractAddr: string;
  tokenID: number;
  approval: number;
  disapproval: number;
  txnStatus: string;
  approvedBy: Signer[];
  disapprovedBy: Signer[];
  createdOn: string;
};

export type ERC1155Transaction = {
  to: string;
  contractAddr: string;
  tokenID: number;
  amount: number;
  approval: number;
  disapproval: number;
  txnStatus: string;
  approvedBy: Signer[];
  disapprovedBy: Signer[];
  createdOn: string;
};

export type Wallet = {
  contractAddress: string;
  owner: Signer;
  signers: Signer[];
  erc20Transactions: ERC20Transaction[];
  erc721Transactions: ERC721Transaction[];
  erc1155Transactions: ERC1155Transaction[];
  createdOn: string;
  balance: string;
  lockedBalance: string;
};

export enum ERCStandards {
  ERC20 = "erc20",
  ERC721 = "erc721",
  ERC1155 = "erc1155",
  ERC777 = "erc777",
}

export type Attribute = {
  trait_type: string;
  value: string;
};

export type external_data = {
  animation_url: string | null;
  attributes: Attribute[] | null;
  description: string | null;
  external_url: string | null;
  image: string | null;
  image_256: string | null;
  image_512: string | null;
  image_1024: string | null;
  name: string | null;
  owner: string | null;
};

export type nft_data = {
  token_id: string | null; //'18772'
  token_balance: string | null; //'1'
  token_url: string | null;
  supports_erc: ERCStandards[] | null;
  token_price_wei: string | null;
  token_quote_rate_eth: number | null;
  original_owner: string | null; //'0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de';
  external_data: external_data | null;
  owner: string | null; //'0xfc43f5f9dd45258b3aff31bdbe6561d97e8b71de'
  owner_address: string | null;
  burned: boolean | null;
};

export type CryptoType = {
  contract_decimals: number; //18
  contract_name: string; //'Ether'
  contract_ticker_symbol: string; //'ETH'
  contract_address: string; //'0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  supports_erc: ERCStandards[] | null; // ['erc20']
  logo_url: string | null; //'https://www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png';
  last_transferred_at: string | null;
  type: "cryptocurrency" | "nft" | "dust" | "stablecoin" | null;
  balance: string | null; //'2543660422529725';
  balance_24h: string | null; //'2543660422529725';
  quote_rate: number | null; // 993.6847;
  quote_rate_24h: number | null; // 1086.517;
  quote: number | null; //  2.5275965;
  quote_24h: number | null; //  2.7637303;
  nft_data: nft_data[] | null;
};
