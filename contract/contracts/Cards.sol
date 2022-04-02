// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "hardhat/console.sol";

contract Cards {

    error NotTheRecipient(address recipient);
    error NotTheCreator(address creator);
    error InvalidRecipient(address recipient);
    error TransferFailed();

    struct GiftCard {
        bytes32 name;
        address payable creator;
        address payable recipient;
        uint256 amount;
        string message;
    }

    event CreateCard(GiftCard card);

    mapping(bytes32 => GiftCard) public cards;
    mapping(address => bytes32[]) public emittedCards;
    mapping(address => bytes32[]) public availableCards;

    function redeemCard(bytes32 name) external {
        GiftCard storage card = cards[name];
        delete cards[name];
        delete emittedCards[card.creator][indexOf(emittedCards[card.creator], name)];
        delete availableCards[card.recipient][indexOf(availableCards[card.recipient], name)];

        if (card.recipient != msg.sender) {
            revert NotTheRecipient(card.recipient);
        }

        (bool success, ) = card.recipient.call{value: card.amount}("");
        if (!success) {
            revert TransferFailed();
        }
    }

    function cancelCard(bytes32 name) external {
        GiftCard storage card = cards[name];
        delete cards[name];
        delete emittedCards[card.creator][indexOf(emittedCards[card.creator], name)];
        delete availableCards[card.recipient][indexOf(availableCards[card.recipient], name)];

        if(card.creator != msg.sender) {
            revert NotTheCreator(card.creator);
        }

        (bool success, ) = card.creator.call{value: card.amount}("");
        if(!success) {
            revert TransferFailed();
        }
    }

    function createCard(bytes32 name, address payable recipient, string calldata message) external payable {
        if(recipient == msg.sender || recipient == address(0)) {
            revert InvalidRecipient(recipient);
        }

        GiftCard memory card = GiftCard({
            name: name,
            creator: payable(msg.sender),
            recipient: payable(recipient),
            amount: msg.value,
            message: message
        });

        emit CreateCard(card);

        cards[name] = card;
        emittedCards[msg.sender].push(name);
        availableCards[recipient].push(name);
    }

    function indexOf(bytes32[] storage array, bytes32 value) internal view returns (uint256) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return i;
            }
        }

        return array.length;
    }

}
