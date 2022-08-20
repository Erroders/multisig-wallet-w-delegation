import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

require('dotenv').config({ path: __dirname + '/.env' });

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
        url: process.env.MUMBAI_ALCHEMY_URL || '',
        accounts: [`0x${process.env.MUMBAI_DEPLOYER_PRIV_KEY}`],
    },
},
};

export default config;