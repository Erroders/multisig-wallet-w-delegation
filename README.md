
# Multisig Wallet with Deligation

This is a multisig wallet with the added functionality of *delegation* where signers of a wallet can assign their voting rights to another signer.

- *Multi-Sig*: Create a new wallet with multiple signers(members) with equal voting rights at the start. 
- *Delegation*: Signers can temporarily grant their voting rights to another signer, increasing the receivers voting weight.
- *Wallet Balance*: Anyone (signer or not) can add balance to the wallet by sending crypto to its address.
- *Create Transaction*: Any signer who has not delegated their rights can create a transaction (transfer tokens to some other wallet) but it will only execute once at least 51% of signers approve the transaction.
- *Any ERC20 Token*: This wallet supports all ERC20 tokens and not just the native ones.
- *NFTs*: This wallet can not only just store ERC20 tokens but ERC721 and ERC1155 as well.🤩

This project is a prototype and is not audited/optimized for industry needs. We do not recommend it to be used until the release of first beta version. However, we have limited resources so feel free to contribute with code, code review, design, bug reports, advice, documentation, or anything else you can think of.
Optimizations : To minimize the gas fees for a tracsaction we used The Graph Protocol.

## Tech Stack

**Smart Contract** : Solidity, Remix IDE
**Blockchain** : Polygon (Mumbai Testnet)
**Client** : Next.js, TailwindCSS,  GraphQL(Apollo Client)
**Wallet** : Metamask, Unstoppable Domain
**Backend** : Hardhat, Ethers.js, The Graph Protocol, Web3Modal
**Deployment** : Alchemy(Contract), Spheron(App)

## Features

- User can create multiple Multisig wallets.
- Add multiple signers to the wallet with equal voting rights.
- Signers can grant their voting rights to other signers, such that the delegated representative can vote on his/her behalf, thus reducing gas costs on transaction approval.
- Anyone (signer or not) can add balance to the wallet by sending crypto or even NFTs to its address
- Any signer who has not delegated their rights can create or approve/disapprove a transaction (transfer tokens to some other wallet) but it will be executed/canceled only after 51% of signers approve/disapprove the transaction.
- Wallet can not only just store ERC20 tokens but ERC721 and ERC1155 as well.
