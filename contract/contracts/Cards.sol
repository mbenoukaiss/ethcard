// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

contract Cards {

    error OngoingTransaction();
    error NotTheBeneficiary(address beneficiary);
    error NotTheCreator(address creator);
    error InvalidBeneficiary(address beneficiary);
    error TransferFailed();

    struct GiftCard {
        bytes32 number;
        bool locked;
        address payable creator;
        address payable beneficiary;
        uint256 amount;
        string message;
    }

    event CreateCard(GiftCard card);

    mapping(bytes32 => GiftCard) public cards;
    mapping(address => bytes32[]) emittedCards;
    mapping(address => bytes32[]) availableCards;

    function getEmittedCards(address emitter) external view returns (bytes32[] memory) {
        return emittedCards[emitter];
    }

    function getAvailableCards(address beneficiary) external view returns (bytes32[] memory) {
        return availableCards[beneficiary];
    }

    function redeemCard(bytes32 number) external payable {
        GiftCard storage card = cards[number];
        if (card.locked) {
            revert OngoingTransaction();
        }

        card.locked = true;

        if (card.beneficiary != msg.sender) {
            revert NotTheBeneficiary(card.beneficiary);
        }

        (bool success,) = card.beneficiary.call{value : card.amount}("");
        if (!success) {
            revert TransferFailed();
        }

        delete emittedCards[card.creator][indexOf(emittedCards[card.creator], number)];
        delete availableCards[card.beneficiary][indexOf(availableCards[card.beneficiary], number)];
        delete cards[number];
    }

    function cancelCard(bytes32 number) external {
        GiftCard storage card = cards[number];
        if (card.locked) {
            revert OngoingTransaction();
        }

        card.locked = true;

        if (card.creator != msg.sender) {
            revert NotTheCreator(card.creator);
        }

        (bool success,) = card.creator.call{value : card.amount}("");
        if (!success) {
            revert TransferFailed();
        }

        delete emittedCards[card.creator][indexOf(emittedCards[card.creator], number)];
        delete availableCards[card.beneficiary][indexOf(availableCards[card.beneficiary], number)];
        delete cards[number];
    }

    function createCard(bytes32 number, address payable beneficiary, string calldata message) external payable {
        if (beneficiary == address(0)) {
            revert InvalidBeneficiary(beneficiary);
        }

        GiftCard memory card = GiftCard({
        number : number,
        locked : false,
        creator : payable(msg.sender),
        beneficiary : payable(beneficiary),
        amount : msg.value,
        message : message
        });

        emit CreateCard(card);

        cards[number] = card;
        emittedCards[msg.sender].push(number);
        availableCards[beneficiary].push(number);
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
