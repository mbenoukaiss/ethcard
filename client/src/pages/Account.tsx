import React, {useContext, useEffect, useState} from "react";
import {CardContext} from "../context/CardContext";

import {Container} from "./Home";
import {Card} from "../contracts/Contracts";
import CardList from "../components/account/CardList";

export default function Account() {
    const [availableCards, setAvailableCards] = useState<Array<Card>>([]);
    const [emittedCards, setEmittedCards] = useState<Array<Card>>([]);
    const {getAvailableCards, getEmittedCards, redeemCard, cancelCard} = useContext(CardContext);

    useEffect(() => {
        getAvailableCards().then(cards => {
            setAvailableCards(cards.filter(card => card.redeemedAt === 0 && card.cancelledAt === 0));
        });

        getEmittedCards().then(cards => {
            setEmittedCards(cards.filter(card => card.redeemedAt === 0 && card.cancelledAt === 0));
        })
    }, [setAvailableCards, getAvailableCards, setEmittedCards, getEmittedCards]);

    return (
        <Container>
            <CardList cards={availableCards}
                      title={`${availableCards.length || `No`} card${availableCards.length !== 1 ? `s` : ``} waiting to be redeemed`}
                      explanation="You will find the cards that have been gifted to you below. Click on the card to redeem the amount."
                      onClick={card => redeemCard(card.number)}/>

            <CardList cards={emittedCards}
                      title={`${emittedCards.length || `No`} card${emittedCards.length !== 1 ? `s` : ``} created by you`}
                      explanation="You will find the cards that you have created below and that have not been redeemed yet below.
                        Click on the card to cancel the emission."
                      onClick={card => cancelCard(card.number)}/>
        </Container>
    );
}
