import React from 'react';
import {FaEthereum} from 'react-icons/fa';
import styled from 'styled-components';
import {Card} from "../../context/CardContext";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 300px;
    height: 170px;
    border-radius: 8px;
    background-color: rgba(83, 202, 255, 0.2);
    padding: 20px 25px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(5px);
    background-image: radial-gradient(at 50% 20%, rgba(0, 177, 255, 0.2) 0, transparent 70%),
    radial-gradient(at 90% 70%, rgba(174, 78, 222, 0.2) 0, transparent 90%),
    radial-gradient(at 0% 90%, rgba(81, 131, 180, 0.2) 0, transparent 30%);
    cursor: pointer;
`;

const Title = styled.h1`
    display: flex;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 500;

    & :first-child {
        margin-right: 8px;
    }
`;

const Subtitle = styled.div`
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 1.0rem;
    font-weight: lighter;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
    padding: 5px 10px;
    width: 100%;
    margin-top: 12px;
    max-height: 3.4em;
`;

const Amount = styled.div`
    font-size: 1.8rem;
    font-weight: bold;
    margin-left: auto;
    width: fit-content;
`;

export type CreditCardProps = {
    card?: Card;
    subtitle?: string;
    amount?: string | number;
    onClick?: () => void;
};

const CreditCard = (props: CreditCardProps) => {
    let card = props.card ?? {
        amount: props.amount as number,
        message: props.subtitle as string,
    };

    return <Container onClick={props.onClick}>
        <div>
            <Title><FaEthereum/> Gift card</Title>
            <Subtitle hidden={!card.message}>{card.message}</Subtitle>
        </div>
        <Amount>{card.amount} Eth</Amount>
    </Container>
}

export default CreditCard;
