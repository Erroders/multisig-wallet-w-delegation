
# Multisig Wallet with Deligation

This is a multisig wallet with the added functionality of *delegation* where signers of a wallet can assign their voting rights to another signer.

- *Multi-Sig*: Create a new wallet with multiple signers(members) with equal voting rights at the start. 
- *Delegation*: Signers can temporarily grant their voting rights to another signer, increasing the receivers voting weight.
- *Wallet Balance*: Anyone (signer or not) can add balance to the wallet by sending crypto to its address.
- *Create Transaction*: Any signer who has not delegated their rights can create a transaction (transfer tokens to some other wallet) but it will only execute once at least 51% of signers approve the transaction.
- *Any ERC20 Token*: This wallet supports all ERC20 tokens and not just the native ones.
- *NFTs*: This wallet can not only just store ERC20 tokens but ERC721 and ERC1155 as well.🤩

This project is a prototype and is not audited/optimized for industry needs. We do not recommend it to be used until the release of first beta version. However, we have limited resources so feel free to contribute with code, code review, design, bug reports, advice, documentation, or anything else you can think of.

## Support

For support, Join our Telegram channel https://t.me/ERRORDERS.

- [View Demo Link](https://multisigwallet-w-delegation.vercel.app/)
- [View Deployment code](https://github.com/rg12301/multisig-wallet-w-delegation)
- Person to contact: Nonit Mittal (NonitMittal#5796), Raghav Goyal (Raghav#6141), Vineet Mishra(vineet-mi), Sparsh Agarwal



## Tech Stack

**Client:** React, NextJs, TailwindCSS, GraphQL(Applo Client) 

**BackEnd:** Solidity, Ethereum, Polygon

**Deployment:** Alchmi, Spheron

**Additional Technology:** EPNS, IPFS/Filecoin, Covalent , Hardhat, Remix IDE, Metamask, NFT.STORAGE(IPFS/Filecoin)
Unstoppable Domain


## Running Tests

To run tests, run the following command

```node
  yarn dev
```


## Usage/Examples

```javascript
import Component from 'my-project'

function App() {
  return <Component />
}
```


## Reviewed By

This project is reviwed by the following companies:

- Devfolio 
- CoinDCX
- Polygon
- Covalent
- EPNS



## Optimizations

To minimize the gas fees for a tracsaction we used GraphQL

## License

GPL-3.0 license

UD registered email email account - nonitmittal@gmail.com




## Lessons Learned

Creating a full-stack three-tier application in a day was an overwhelming self-taken task. The core business logic behind this problem is very well formulated after hours of brainstorming and successfully executed as a prototype within the given time, however, the UI/UX could be enhanced in the future.


## 🛠 Skills
NextJs, TailwindCSS, Solidity, Smart Contracts...


## 🚀 About Erroders



## Features

- Creat Multiple wallets
- Add Multiple Number of Signers in a wallets 
- This wallet supports all ERC20 tokens and not just the native ones. 
- This wallet can not only just store ERC20 tokens but ERC721 and ERC1155 as well.🤩

