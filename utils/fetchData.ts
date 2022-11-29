import axios from "axios";
import { ethers } from "ethers";
import { executeQuery } from "./apolloClient";
import { getIPFSUrl } from "./getIPFSUrl";
import {
    ERC1155Token,
    ERC1155Transaction,
    ERC20Token,
    ERC20Transaction,
    ERC721Token,
    ERC721Transaction,
    Signer,
    SignerMetadata,
    Wallet,
    WalletMetadata,
} from "./types";

const chainId = 80001;

async function fetchIPFSNftData(nftData: any) {
    const nftFetchedData = {
        name: "",
        description: "",
        image: "",
    };
    if (nftData.external_data) {
        if (
            nftData.external_data.name ||
            nftData.external_data.description ||
            nftData.external_data.image
        ) {
            nftFetchedData.name = nftData.external_data.name
                ? nftData.external_data.name
                : "";
            nftFetchedData.description = nftData.external_data.description
                ? nftData.external_data.description
                : "";
            nftFetchedData.image = nftData.external_data.image
                ? getIPFSUrl(nftData.external_data.image)
                : "";
        } else if (nftData.external_data.external_url) {
            const response = await fetch(
                getIPFSUrl(nftData.external_data.external_url),
                {
                    headers: {
                        Accept: "application/json",
                    },
                }
            );
            const metadata_fetched = await response.json();
            if (metadata_fetched) {
                nftFetchedData.name = metadata_fetched.name
                    ? metadata_fetched.name
                    : "";
                nftFetchedData.description = metadata_fetched.description
                    ? metadata_fetched.description
                    : "";
                if (metadata_fetched.image) {
                    const img_url = getIPFSUrl(metadata_fetched.image);
                    nftFetchedData.image = img_url;
                } else {
                    nftFetchedData.image = "";
                }
            }
        }
        return nftFetchedData;
    }
    return nftFetchedData;
}

async function asERC20Token(
    walletAddr: string,
    tokenData: any
): Promise<ERC20Token> {
    let id = tokenData.native_token
        ? walletAddr.toLowerCase() +
          "0x0000000000000000000000000000000000000000"
        : walletAddr.toLowerCase() + tokenData.contract_address.toLowerCase();
    const graphData = await executeQuery(`
      query{
        erc20LockedBalance(id : "${id}"){
          id
          contractAddr
          lockedBalance
        }
      }`);
    const erc20Token: ERC20Token = {
        contractName: tokenData.contract_name,
        contractAddr: tokenData.native_token
            ? "0x0000000000000000000000000000000000000000"
            : tokenData.contract_address.toLowerCase(),
        contractTickerSymbol: tokenData.contract_ticker_symbol,
        balance: tokenData.balance,
        lockedBalance: graphData.erc20LockedBalance
            ? graphData.erc20LockedBalance.lockedBalance
            : 0,
        decimals: tokenData.contract_decimals,
        quoteRate: tokenData.quote_rate,
        logoUrl: tokenData.logo_url,
    };
    return erc20Token;
}

async function asERC721Token(
    walletAddr: string,
    tokenData: any
): Promise<ERC721Token[]> {
    const erc721Tokens: ERC721Token[] = [];

    for (let i = 0; i < tokenData.nft_data.length; i++) {
        const nft = tokenData.nft_data[i];
        const graphData = await executeQuery(`
            query{
              erc721LockedBalance(id : "${
                  walletAddr.toLowerCase() +
                  tokenData.contract_address.toLowerCase() +
                  nft.token_id
              }"){
                id
                contractAddr
                tokenId
                lockedBool
              }
            }`);
        const { name, description, image } = await fetchIPFSNftData(nft);
        const erc721Token: ERC721Token = {
            contractName: tokenData.contract_name,
            contractAddr: tokenData.contract_address.toLowerCase(),
            contractTickerSymbol: tokenData.contract_ticker_symbol,
            nftName: name,
            description: description,
            url: image,
            tokenId: nft.token_id,
            locked: graphData.erc721LockedBalance
                ? graphData.erc721LockedBalance.lockedBool
                : false,
        };
        erc721Tokens.push(erc721Token);
    }
    return erc721Tokens;
}

async function asERC1155Token(
    walletAddr: string,
    tokenData: any
): Promise<ERC1155Token[]> {
    const erc1155Tokens: ERC1155Token[] = [];

    for (let i = 0; i < tokenData.nft_data.length; i++) {
        const nft = tokenData.nft_data[i];
        const graphData = await executeQuery(`
          query{
            erc1155LockedBalance(id : "${
                walletAddr.toLowerCase() +
                tokenData.contract_address.toLowerCase() +
                nft.token_id
            }"){
              id
              contractAddr
              tokenId
              lockedBalance
            }
          }`);
        const { name, description, image } = await fetchIPFSNftData(nft);
        const erc1155Token: ERC1155Token = {
            contractName: tokenData.contract_name,
            contractAddr: tokenData.contract_address.toLowerCase(),
            contractTickerSymbol: tokenData.contract_ticker_symbol,
            nftName: name,
            description: description,
            url: image,
            tokenBalance: nft.token_balance,
            tokenId: nft.token_id,
            lockedBalance: graphData.erc1155LockedBalance
                ? graphData.erc1155LockedBalance.lockedBalance
                : 0,
        };
        erc1155Tokens.push(erc1155Token);
    }
    return erc1155Tokens;
}

async function getTokenData(walletAddress: string): Promise<any> {
    const endPoint = process.env.NEXT_PUBLIC_COVALENT_ENDPOINT || "";
    const apiKey = process.env.NEXT_PUBLIC_COVALENT_APIKEY || "";
    const url = `${endPoint}${chainId}/address/${walletAddress}/balances_v2/?key=${apiKey}&format=json&nft=true&no-nft-fetch=false`;

    const erc20Tokens: ERC20Token[] = [];
    let erc721Tokens: ERC721Token[] = [];
    let erc1155Tokens: ERC1155Token[] = [];

    const axiosRawData = await axios.get(url);
    const allTokens = axiosRawData.data.data.items;
    console.log(allTokens);

    for (let i = 0; i < allTokens.length; i++) {
        const tokenData = allTokens[i];
        if (
            tokenData.type == "nft" &&
            tokenData.nft_data &&
            tokenData.supports_erc
        ) {
            if (tokenData.supports_erc.includes("ERC1155")) {
                const erc1155Tokens_ = await asERC1155Token(
                    walletAddress,
                    tokenData
                );
                erc1155Tokens = [...erc1155Tokens, ...erc1155Tokens_];
            } else {
                const erc721Tokens_ = await asERC721Token(
                    walletAddress,
                    tokenData
                );
                erc721Tokens = [...erc721Tokens, ...erc721Tokens_];
            }
        } else if (
            tokenData.type == "cryptocurrency" ||
            tokenData.type == "stablecoin" ||
            tokenData.type == "dust"
        ) {
            const erc20Token = await asERC20Token(walletAddress, tokenData);
            erc20Tokens.push(erc20Token);
        }
    }
    return {
        erc20Tokens,
        erc721Tokens,
        erc1155Tokens,
    };
}

// -------------------------------------------------------------------------------------

// return basic details of all the wallets the user is Signer in.
// don not return everything return (walletaddr, name, desc, signers[])
export async function fetchWallets(signer: Signer): Promise<Wallet[]> {
    const query = `query{
        wallets(where : { signers_: { address: "${signer.address.toLowerCase()}" } }, orderBy: createdOn, orderDirection: desc){
          id
          createdOn
          owner{
              address
          }
          metadata{
            title
            description
          }
        }
    }`;
    const data = await executeQuery(query);

    console.log(data);
    const wallets = data.wallets as any[];
    return wallets.map((wallet_) => {
        const owner_: Signer = {
            address: wallet_.owner.address,
            signer: null,
        };
        const wallet: Wallet = {
            contractAddress: wallet_.id,
            owner: owner_,
            signers: [],
            erc20Transactions: [],
            erc721Transactions: [],
            erc1155Transactions: [],
            createdOn: wallet_.createdOn,
            metadata: wallet_.metadata,
            erc20tokens: [],
            erc721tokens: [],
            erc1155tokens: [],
        };
        return wallet;
    });
}

// return every details of a wallet
// also fetching details of ERC tokens from Covalent API
export async function fetchWallet(walletAddr: string): Promise<Wallet | null> {
    if (walletAddr) {
        const query = `query{
                        wallet(id:"${walletAddr.toLowerCase()}"){
                            id
                            owner{
                                address
                                weight
                                txnCap
                                delegateTo
                                metadata{
                                    name
                                    contactNo
                                    email
                                    walletAddress
                                    role
                                    remarks
                                }
                            }
                            signers{
                                address
                                weight
                                txnCap
                                delegateTo
                                metadata{
                                    name
                                    contactNo
                                    email
                                    walletAddress
                                    role
                                    remarks
                                }
                            }
                            createdOn
                            erc20Transactions(orderBy: txnId, orderDirection:desc){
                                txnId
                                to
                                contractAddr
                                amount
                                approval
                                disapproval
                                txnStatus
                                createdBy{
                                    address
                                }
                                approvedBy{
                                    address
                                }
                                disapprovedBy{
                                    address
                                }
                                createdOn
                                executedOn
                            }
                            erc721Transactions(orderBy: txnId, orderDirection:desc){
                                txnId
                                to
                                contractAddr
                                tokenId
                                approval
                                disapproval
                                txnStatus
                                createdBy{
                                    address
                                }
                                approvedBy{
                                    address
                                }
                                disapprovedBy{
                                    address
                                }
                                createdOn
                                executedOn
                            }
                            erc1155Transactions(orderBy: txnId, orderDirection:desc){
                                txnId
                                to
                                contractAddr
                                tokenId
                                amount
                                approval
                                disapproval
                                txnStatus
                                createdBy{
                                    address
                                }
                                approvedBy{
                                    address
                                }
                                disapprovedBy{
                                    address
                                }
                                createdOn
                                executedOn
                            }
                            metadata{
                                title
                                description
                            }
                        }
                    }`;
        const data = await executeQuery(query);

        if (data.wallet) {
            const { erc20Tokens, erc721Tokens, erc1155Tokens } =
                await getTokenData(walletAddr);

            const owner_: Signer = {
                address: data.wallet.owner.address,
                weight: data.wallet.owner.weight,
                delegateTo: data.wallet.owner.delegateTo,
                metadata: data.wallet.owner.metadata as SignerMetadata,
                txnCap: data.wallet.owner.txnCap,
                signer: null,
            };

            const walletSigners = data.wallet.signers as any[];
            const signers_ = walletSigners.map((signer_) => {
                const walletSigner: Signer = {
                    address: signer_.address,
                    weight: signer_.weight,
                    delegateTo: signer_.delegateTo,
                    metadata: signer_.metadata as SignerMetadata,
                    txnCap: signer_.txnCap,
                    signer: null,
                };
                return walletSigner;
            });

            const wallet_: Wallet = {
                contractAddress: data.wallet.id,
                owner: owner_,
                signers: signers_,
                erc20Transactions: data.wallet
                    .erc20Transactions as ERC20Transaction[],
                erc721Transactions: data.wallet
                    .erc721Transactions as ERC721Transaction[],
                erc1155Transactions: data.wallet
                    .erc115Transactions as ERC1155Transaction[],
                createdOn: data.wallet.createdOn,
                metadata: data.wallet.metadata as WalletMetadata,
                erc20tokens: erc20Tokens,
                erc721tokens: erc721Tokens,
                erc1155tokens: erc1155Tokens,
            };
            console.log(wallet_);
            return wallet_;
        } else {
            return null;
        }
    }
    return null;
}

// return every Signer Details for a particular wallet address
export async function fetchSigner(
    walletAddr: string,
    signer: ethers.Signer
): Promise<Signer | null> {
    const signerAddr_ = await signer.getAddress();
    const signerId = walletAddr.toLowerCase() + signerAddr_.toLowerCase();
    const query = `query{
                    signer(id: "${signerId}"){
                        id
                        address
                        weight
                        txnCap
                        delegateTo
                        metadata{
                            name
                            contactNo
                            email
                            walletAddress
                            role
                            remarks
                        }
                    }
                }`;
    const data = await executeQuery(query);
    console.log(data);
    if (data.signer) {
        const userData: Signer = {
            address: data.signer.address,
            weight: data.signer.weight,
            delegateTo: data.signer.delegateTo,
            metadata: data.signer.metadata as SignerMetadata,
            txnCap: data.signer.txnCap,
            signer: signer,
        };
        return userData;
    }
    return null;
}
