// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Cards {

    error Redeemed();
    error Cancelled();
    error DoesNotExist();
    error NotTheBeneficiary(address beneficiary);
    error NotTheCreator(address creator);
    error InvalidBeneficiary(address beneficiary);
    error InvalidAmount(uint256 amount);
    error TransferFailed();

    struct GiftCard {
        bytes32 number;
        address payable creator;
        address payable beneficiary;
        uint256 amount;
        string message;

        uint256 redeemedAt;
        uint256 cancelledAt;
    }

    event CreatedCard(bytes32 card);
    event RedeemedCard(bytes32 card);
    event CancelledCard(bytes32 card);

    uint256 cardsCount;
    mapping(bytes32 => GiftCard) cards;
    mapping(address => bytes32[]) emittedCards;
    mapping(address => bytes32[]) availableCards;

    modifier onlyUsable(bytes32 card) {
        if (cards[card].redeemedAt != 0) {
            revert Redeemed();
        }

        if (cards[card].cancelledAt != 0) {
            revert Cancelled();
        }

        _;
    }

    function getCardsCount() external view returns (uint256) {
        return cardsCount;
    }

    function getCard(bytes32 number) external view returns (GiftCard memory) {
        return cards[number];
    }

    function getEmittedCards(address emitter) external view returns (bytes32[] memory) {
        return emittedCards[emitter];
    }

    function getAvailableCards(address beneficiary) external view returns (bytes32[] memory) {
        return availableCards[beneficiary];
    }

    function createCard(bytes32 number, address payable beneficiary, string calldata message) external payable {
        if (beneficiary == address(0)) {
            revert InvalidBeneficiary(beneficiary);
        }

        if (msg.value < 0.0001 ether) {
            revert InvalidAmount(msg.value);
        }

        GiftCard memory card = GiftCard({
            number : number,
            creator : payable(msg.sender),
            beneficiary : payable(beneficiary),
            amount : msg.value,
            message : message,
            redeemedAt : 0,
            cancelledAt : 0
        });

        cardsCount++;
        cards[number] = card;
        emittedCards[msg.sender].push(number);
        availableCards[beneficiary].push(number);

        emit CreatedCard(number);
    }

    function redeemCard(bytes32 number) external payable onlyUsable(number) {
        GiftCard storage card = cards[number];
        card.redeemedAt = block.timestamp;

        if (card.number == 0) {
            revert DoesNotExist();
        }

        if (card.beneficiary != msg.sender) {
            revert NotTheBeneficiary(card.beneficiary);
        }

        (bool success,) = card.beneficiary.call{value : card.amount}("");
        if (!success) {
            revert TransferFailed();
        }

        emit RedeemedCard(number);
    }

    function cancelCard(bytes32 number) external payable onlyUsable(number) {
        GiftCard storage card = cards[number];
        card.cancelledAt = block.timestamp;

        if (card.number == 0) {
            revert DoesNotExist();
        }

        if (card.creator != msg.sender) {
            revert NotTheCreator(card.creator);
        }

        (bool success,) = card.creator.call{value : card.amount}("");
        if (!success) {
            revert TransferFailed();
        }

        emit CancelledCard(number);
    }

}
