// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title MultisigWallet
 * @dev Implements multisig wallet along with rights delegation
 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";

contract MultisigWallet is Ownable, ERC721Holder, ERC1155Holder {
    uint256 public _signerCount;

    // events ----------------------------------------------------
    // signers
    event Delegate(address indexed from, address indexed to);
    event RevokeDelegation(address indexed signer);
    event SignerTxnCapUpdated(address indexed signer, int256 txnCap);
    event SignerAdded(address indexed signerAddress, string cid, int256 txnCap);

    // ERC20
    event ERC20TransactionCreated(
        uint256 txnId,
        address indexed to,
        address indexed contractAddr,
        uint256 amount
    );
    event ERC20TransactionApproved(uint256 txnId, address indexed approver);
    event ERC20TransactionExecuted(uint256 txnId);
    event ERC20TransactionDisapproved(
        uint256 txnId,
        address indexed disapprover
    );
    event ERC20TransactionCancelled(uint256 txnId);

    // ERC721
    event ERC721TransactionCreated(
        uint256 txnId,
        address indexed to,
        address indexed contractAddr,
        uint256 tokenId
    );
    event ERC721TransactionApproved(uint256 txnId, address indexed approver);
    event ERC721TransactionExecuted(uint256 txnId);
    event ERC721TransactionDisapproved(
        uint256 txnId,
        address indexed disapprover
    );
    event ERC721TransactionCancelled(uint256 txnId);

    // ERC1155
    event ERC1155TransactionCreated(
        uint256 txnId,
        address indexed to,
        address indexed contractAddr,
        uint256 amount,
        uint256 tokenId
    );
    event ERC1155TransactionApproved(uint256 txnId, address indexed approver);
    event ERC1155TransactionExecuted(uint256 txnId);
    event ERC1155TransactionDisapproved(
        uint256 txnId,
        address indexed disapprover
    );
    event ERC1155TransactionCancelled(uint256 txnId);

    // enums ----------------------------------------------------
    enum TxnStatus {
        CREATED,
        WAITING_APPROVAL,
        CANCELLED,
        EXECUTED
    }

    // structs --------------------------------------------------
    struct Signer {
        address delegateTo;
        uint256 weight;
        int256 txnCap;
    }

    struct ERC20Transaction {
        TxnStatus status;
        address to;
        address contractAddr;
        uint256 amount;
        uint256 approval;
        uint256 disapproval;
    }

    struct ERC721Transaction {
        TxnStatus status;
        address to;
        address contractAddr;
        uint256 tokenId;
        uint256 approval;
        uint256 disapproval;
    }

    struct ERC1155Transaction {
        TxnStatus status;
        address to;
        address contractAddr;
        uint256 tokenId;
        uint256 amount;
        uint256 approval;
        uint256 disapproval;
    }

    // mappings --------------------------------------------------
    mapping(address => Signer) public signers;

    ERC20Transaction[] public erc20Transactions;
    ERC721Transaction[] public erc721Transactions;
    ERC1155Transaction[] public erc1155Transactions;

    mapping(address => uint256) public erc20LockedBalance;
    mapping(address => mapping(uint256 => bool)) public erc721LockedBalance;
    mapping(address => mapping(uint256 => uint256)) public erc1155LockedBalance;

    // constructor -----------------------------------------------
    constructor(address owner) {
        signers[owner].weight = 1;
        signers[owner].txnCap = -1;
        _signerCount = 1;
    }

    receive() external payable {}

    fallback() external payable {}

    // signer -----------------------------------------------
    function addSigner(
        address signer_,
        int256 txnCap_,
        string memory cid_
    ) public onlyOwner {
        require(signers[signer_].weight == 0, "Signer already added.");
        signers[signer_].weight = 1;
        signers[signer_].txnCap = txnCap_;
        _signerCount += 1;
        emit SignerAdded(signer_, cid_, txnCap_);
    }

    function delegate(address to_) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        require(signers[to_].weight > 0, "Invalid delegate.");
        require(to_ != msg.sender, "Self-delegation is disallowed.");
        Signer storage signer = signers[msg.sender];
        address to = to_;

        while (signers[to].delegateTo != address(0)) {
            to = signers[to].delegateTo;
            // found a loop in the delegation, not allowed.
            require(to != msg.sender, "Found loop in delegation.");
        }
        to = to_;
        while (to != address(0)) {
            Signer storage delegate_ = signers[to];
            delegate_.weight += signer.weight;
            to = delegate_.delegateTo;
        }
        signer.delegateTo = to_;
        emit Delegate(msg.sender, to_);
    }

    function revokeDelegation() public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo != address(0),
            "Invalid request."
        );
        Signer storage signer = signers[msg.sender];
        address delegateAddr = signer.delegateTo;
        while (delegateAddr != address(0)) {
            Signer storage delegate_ = signers[delegateAddr];
            delegate_.weight -= signer.weight;
            delegateAddr = delegate_.delegateTo;
        }
        signer.delegateTo = address(0);
        emit RevokeDelegation(msg.sender);
    }

    function updateTxnCap(address signer_, int256 txnCap_) public onlyOwner {
        require(signers[signer_].weight > 0, "Signer does not exists.");
        signers[signer_].txnCap = txnCap_;
        emit SignerTxnCapUpdated(signer_, txnCap_);
    }

    // ERC20 -----------------------------------------------
    function createERC20Transaction(
        address to_,
        address contractAddr_,
        uint256 amount_
    ) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        require(
            (signers[msg.sender].txnCap == -1) ||
                (signers[msg.sender].txnCap >= int256(amount_)),
            "Transaction cap exceeded."
        );
        if (contractAddr_ == address(this)) {
            require(
                address(this).balance - erc20LockedBalance[contractAddr_] >=
                    amount_,
                "Insufficient balance in wallet."
            );
        } else {
            IERC20 erc20Contract = IERC20(contractAddr_);
            require(
                erc20Contract.balanceOf(contractAddr_) -
                    erc20LockedBalance[contractAddr_] >=
                    amount_,
                "Insufficient balance in wallet."
            );
        }
        ERC20Transaction memory txn = ERC20Transaction({
            status: TxnStatus.CREATED,
            to: to_,
            contractAddr: contractAddr_,
            amount: amount_,
            approval: 0,
            disapproval: 0
        });
        erc20Transactions.push(txn);
        erc20LockedBalance[contractAddr_] += amount_;

        emit ERC20TransactionCreated(
            erc20Transactions.length - 1,
            to_,
            contractAddr_,
            amount_
        );
        _approveERC20Transaction(erc20Transactions.length - 1, msg.sender);
    }

    function approveERC20Transaction(uint256 txnId_) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        _approveERC20Transaction(txnId_, msg.sender);
    }

    function disapproveERC20Trasaction(uint256 txnId_) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        _disapproveERC20Transaction(txnId_, msg.sender);
    }

    function _approveERC20Transaction(uint256 txnId_, address approver_)
        internal
    {
        Signer memory signer = signers[approver_];
        ERC20Transaction storage txn = erc20Transactions[txnId_];
        txn.approval += signer.weight;
        txn.status = TxnStatus.WAITING_APPROVAL;
        emit ERC20TransactionApproved(txnId_, approver_);

        if (txn.approval * 100 >= 51 * _signerCount) {
            _executeERC20Transaction(txnId_);
        }
    }

    function _executeERC20Transaction(uint256 txnId_) internal {
        ERC20Transaction storage txn = erc20Transactions[txnId_];
        if (txn.contractAddr == address(this)) {
            payable(txn.to).transfer(txn.amount);
        } else {
            IERC20 erc20Contract = IERC20(txn.contractAddr);
            erc20Contract.transfer(txn.to, txn.amount);
        }
        txn.status = TxnStatus.EXECUTED;
        erc20LockedBalance[txn.contractAddr] -= txn.amount;
        emit ERC20TransactionExecuted(txnId_);
    }

    function _disapproveERC20Transaction(uint256 txnId_, address disapprover_)
        internal
    {
        Signer memory signer = signers[disapprover_];
        ERC20Transaction storage txn = erc20Transactions[txnId_];
        txn.disapproval += signer.weight;
        emit ERC20TransactionDisapproved(txnId_, disapprover_);

        if (txn.disapproval * 100 >= 51 * _signerCount) {
            _cancelERC20Transaction(txnId_);
        }
    }

    function _cancelERC20Transaction(uint256 txnId_) internal {
        ERC20Transaction storage txn = erc20Transactions[txnId_];
        txn.status = TxnStatus.CANCELLED;
        erc20LockedBalance[txn.contractAddr] -= txn.amount;
        emit ERC20TransactionCancelled(txnId_);
    }

    // ERC721 -----------------------------------------------
    function createERC721Transaction(
        address to_,
        address contractAddr_,
        uint256 tokenId_
    ) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        IERC721 erc721Contract = IERC721(contractAddr_);
        require(
            erc721Contract.ownerOf(tokenId_) == address(this),
            "NFT not owned by wallet."
        );
        require(
            !erc721LockedBalance[contractAddr_][tokenId_],
            "NFT locked in wallet."
        );
        ERC721Transaction memory txn = ERC721Transaction({
            status: TxnStatus.CREATED,
            to: to_,
            contractAddr: contractAddr_,
            tokenId: tokenId_,
            approval: 0,
            disapproval: 0
        });
        erc721Transactions.push(txn);
        erc721LockedBalance[contractAddr_][tokenId_] = true;

        emit ERC721TransactionCreated(
            erc721Transactions.length - 1,
            to_,
            contractAddr_,
            tokenId_
        );
        _approveERC721Transaction(erc20Transactions.length - 1, msg.sender);
    }

    function approveERC721Transaction(uint256 txnId_) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        _approveERC721Transaction(txnId_, msg.sender);
    }

    function disapproveERC721Trasaction(uint256 txnId_) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        _disapproveERC721Transaction(txnId_, msg.sender);
    }

    function _approveERC721Transaction(uint256 txnId_, address approver_)
        internal
    {
        Signer memory signer = signers[approver_];
        ERC721Transaction storage txn = erc721Transactions[txnId_];
        txn.approval += signer.weight;
        txn.status = TxnStatus.WAITING_APPROVAL;
        emit ERC721TransactionApproved(txnId_, approver_);

        if (txn.approval * 100 >= 51 * _signerCount) {
            _executeERC721Transaction(txnId_);
        }
    }

    function _executeERC721Transaction(uint256 txnId_) internal {
        ERC721Transaction storage txn = erc721Transactions[txnId_];
        IERC721 erc721Contract = IERC721(txn.contractAddr);
        erc721Contract.safeTransferFrom(address(this), txn.to, txnId_);
        txn.status = TxnStatus.EXECUTED;
        erc721LockedBalance[txn.contractAddr][txn.tokenId] = false;
        emit ERC721TransactionExecuted(txnId_);
    }

    function _disapproveERC721Transaction(uint256 txnId_, address disapprover_)
        internal
    {
        Signer memory signer = signers[disapprover_];
        ERC721Transaction storage txn = erc721Transactions[txnId_];
        txn.disapproval += signer.weight;
        emit ERC721TransactionDisapproved(txnId_, disapprover_);

        if (txn.disapproval * 100 >= 51 * _signerCount) {
            _cancelERC721Transaction(txnId_);
        }
    }

    function _cancelERC721Transaction(uint256 txnId_) internal {
        ERC721Transaction storage txn = erc721Transactions[txnId_];
        txn.status = TxnStatus.CANCELLED;
        erc721LockedBalance[txn.contractAddr][txn.tokenId] = false;
        emit ERC721TransactionCancelled(txnId_);
    }

    // ERC1155 -----------------------------------------------
    function createERC1155Transaction(
        address to_,
        address contractAddr_,
        uint256 tokenId_,
        uint256 amount_
    ) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        IERC1155 erc1155Contract = IERC1155(contractAddr_);
        uint256 balance = erc1155Contract.balanceOf(contractAddr_, tokenId_);
        require(balance > 0, "NFT not owned by wallet.");
        require(
            balance - erc1155LockedBalance[contractAddr_][tokenId_] >= amount_,
            "NFT locked in wallet."
        );
        ERC1155Transaction memory txn = ERC1155Transaction({
            status: TxnStatus.CREATED,
            to: to_,
            contractAddr: contractAddr_,
            tokenId: tokenId_,
            amount: amount_,
            approval: 0,
            disapproval: 0
        });
        erc1155Transactions.push(txn);
        erc1155LockedBalance[contractAddr_][tokenId_] += amount_;

        emit ERC1155TransactionCreated(
            erc1155Transactions.length - 1,
            to_,
            contractAddr_,
            amount_,
            tokenId_
        );
        _approveERC1155Transaction(erc20Transactions.length - 1, msg.sender);
    }

    function approveERC1155Transaction(uint256 txnId_) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        _approveERC1155Transaction(txnId_, msg.sender);
    }

    function disapproveERC1155Trasaction(uint256 txnId_) public {
        require(
            signers[msg.sender].weight > 0 &&
                signers[msg.sender].delegateTo == address(0),
            "Invalid request."
        );
        _disapproveERC1155Transaction(txnId_, msg.sender);
    }

    function _approveERC1155Transaction(uint256 txnId_, address approver_)
        internal
    {
        Signer memory signer = signers[approver_];
        ERC1155Transaction storage txn = erc1155Transactions[txnId_];
        txn.approval += signer.weight;
        txn.status = TxnStatus.WAITING_APPROVAL;
        emit ERC1155TransactionApproved(txnId_, approver_);

        if (txn.approval * 100 >= 51 * _signerCount) {
            _executeERC1155Transaction(txnId_);
        }
    }

    function _executeERC1155Transaction(uint256 txnId_) internal {
        ERC1155Transaction storage txn = erc1155Transactions[txnId_];
        IERC1155 erc1155Contract = IERC1155(txn.contractAddr);
        erc1155Contract.safeTransferFrom(address(this), txn.to, txn.tokenId, txn.amount, "");
        txn.status = TxnStatus.EXECUTED;
        erc1155LockedBalance[txn.contractAddr][txn.tokenId] -= txn.amount;
        emit ERC1155TransactionExecuted(txnId_);
    }

    function _disapproveERC1155Transaction(uint256 txnId_, address disapprover_)
        internal
    {
        Signer memory signer = signers[disapprover_];
        ERC1155Transaction storage txn = erc1155Transactions[txnId_];
        txn.disapproval += signer.weight;
        emit ERC1155TransactionDisapproved(txnId_, disapprover_);

        if (txn.disapproval * 100 >= 51 * _signerCount) {
            _cancelERC1155Transaction(txnId_);
        }
    }

    function _cancelERC1155Transaction(uint256 txnId_) internal {
        ERC1155Transaction storage txn = erc1155Transactions[txnId_];
        txn.status = TxnStatus.CANCELLED;
        erc1155LockedBalance[txn.contractAddr][txn.tokenId] -= txn.amount;
        emit ERC1155TransactionCancelled(txnId_);
    }
}
