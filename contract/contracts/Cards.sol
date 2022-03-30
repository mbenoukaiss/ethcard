// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import "hardhat/console.sol";

contract Cards {

    error NotTheRecipient(address recipient);
    error NotTheCreator(address creator);
    error InvalidRecipient(address recipient);
    error TransferFailed();

    struct GiftCard {
        uint256 id;
        address payable creator;
        address payable recipient;
        uint256 amount;
        string message;
    }

    event CreateCard(GiftCard card);

    uint256 nextId = 0;
    mapping(uint256 => GiftCard) public cards;
    mapping(address => uint256[]) public emittedCards;
    mapping(address => uint256[]) public availableCards;

    function redeemCard(uint256 cardId) external {
        GiftCard storage card = cards[cardId];
        delete cards[cardId];
        delete emittedCards[card.creator][indexOf(emittedCards[card.creator], cardId)];
        delete availableCards[card.recipient][indexOf(availableCards[card.recipient], cardId)];

        if (card.recipient != msg.sender) {
            revert NotTheRecipient(card.recipient);
        }

        (bool success, ) = card.recipient.call{value: card.amount}("");
        if (!success) {
            revert TransferFailed();
        }
    }

    function cancelCard(uint256 cardId) external {
        GiftCard storage card = cards[cardId];
        delete cards[cardId];
        delete emittedCards[card.creator][indexOf(emittedCards[card.creator], cardId)];
        delete availableCards[card.recipient][indexOf(availableCards[card.recipient], cardId)];

        if(card.creator != msg.sender) {
            revert NotTheCreator(card.creator);
        }

        (bool success, ) = card.creator.call{value: card.amount}("");
        if(!success) {
            revert TransferFailed();
        }
    }

    function createCard(address payable recipient, string calldata message) external payable {
        if(recipient == msg.sender || recipient == address(0)) {
            revert InvalidRecipient(recipient);
        }

        GiftCard memory card = GiftCard({
            id: nextId,
            creator: payable(msg.sender),
            recipient: payable(recipient),
            amount: msg.value,
            message: message
        });

        emit CreateCard(card);

        cards[nextId] = card;
        emittedCards[msg.sender].push(nextId);
        availableCards[recipient].push(nextId);

        nextId++;
    }

    function indexOf(uint256[] storage array, uint256 value) internal view returns (uint256) {
        for (uint256 i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return i;
            }
        }

        return array.length;
    }

}
