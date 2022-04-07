import React from "react";
import styled from 'styled-components';
import Flex from "../common/Flex";
import CreditCard from "../CreditCard";
import {Card} from "../../contracts/CardContext";
import Button, {ButtonType} from "../common/Button";

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
    action: string;
    button: ButtonType;
    onClick: (card: Card) => void;
};

export default function CardList(props: CardListProps) {
    return <div className="mb-4">
        <Title>{props.title}</Title>
        <Explanation>{props.explanation}</Explanation>
        <Flex row="flex-start">
            {props.cards.map(card => <CreditCard key={card.number} card={card} animation={false} className="mr-1">
                <Button type={props.button} onClick={() => props.onClick(card)}>{props.action}</Button>
            </CreditCard>)}
        </Flex>
    </div>
}