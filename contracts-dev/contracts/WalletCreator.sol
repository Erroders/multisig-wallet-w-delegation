// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title WalletCreator
 * @dev Creates multisig wallet assigning owner.
 */

import "./MultisigWallet.sol";

contract WalletCreator {

    event WalletCreated(
        address indexed ownerAddress,
        address indexed walletAddress,
        string walletCid,
        string ownerCid
    );

    constructor() {}
  
    function createWallet(string memory walletCid_, string memory ownerCid_) public {
        MultisigWallet newWallet = new MultisigWallet(msg.sender);
        newWallet.transferOwnership(msg.sender);
        emit WalletCreated(msg.sender, address(newWallet), walletCid_, ownerCid_);
    }
    
}