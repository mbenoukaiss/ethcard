import React from 'react';
import {FaEthereum} from 'react-icons/fa';
import styled from 'styled-components';

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

const Amount = styled.div`
    font-size: 1.8rem;
    font-weight: bold;
    margin-left: auto;
    width: fit-content;
`;

export type CardProps = {
    amount?: string;
};

const Card = (props: CardProps) => {
    return <Container>
        <Title><FaEthereum/> Gift card</Title>
        <Amount>{props.amount} Eth</Amount>
    </Container>
}

export default Card;