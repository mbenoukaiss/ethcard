import React from "react";
import styled from 'styled-components';
import Flex from "../common/Flex";
import CreditCard from "../CreditCard";
import {Card} from "../../contracts/Contracts";

const Title = styled.h1`
    font-size: 2rem;
`;

const Explanation = styled.p`
    font-size: 1.2rem;
    margin-bottom: 10px;
`;

export type CardListProps = {
    cards: Array<Card>;
    title: string;
    explanation: string;
    onClick: (card: Card) => void;
};

export default function CardList(props: CardListProps) {
    return <div className="mb-4">
        <Title>{props.title}</Title>
        <Explanation>{props.explanation}</Explanation>
        <Flex row="flex-start">
            {props.cards.map(card => <CreditCard key={card.number} card={card} onClick={() => props.onClick(card)}/>)}
        </Flex>
    </div>
}