import {ethers} from "hardhat";

async function main() {
  const MultisigWallet = await ethers.getContractFactory("MultisigWallet");
  const contract = await MultisigWallet.deploy();
  await contract.deployed();
  console.log(
    `Deployment successful!\nContract Address: ${contract.address}`,
);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
