import React, {useContext, useEffect, useState} from "react";
import {Card, CardContext} from "../context/CardContext";
import CreditCard from "../components/home/CreditCard";

import styled from 'styled-components';
import {Container} from "./Home";

const Title = styled.h1`
    font-size: 2rem;
`;

const Explanation = styled.p`
    font-size: 1.2rem;
`;

export default function Redeem() {
    const [cards, setCards] = useState<Array<Card>>([]);
    const {getAvailableCards, redeemCard} = useContext(CardContext);

    useEffect(() => {
        getAvailableCards().then(cards => {
            setCards(cards);
        })
    }, [setCards, getAvailableCards]);

    return (
        <Container>
            <Title>{cards.length || `No`} card{cards.length !== 1 ? `s` : ``} waiting to be redeemed</Title>
            <Explanation>
                You will find the cards that have been gifted to you below. Click on the card to redeem the amount.
            </Explanation>
            {cards.map(card => <CreditCard key={card.number} card={card} onClick={() => redeemCard(card.number)}/>)}
        </Container>
    );
}
