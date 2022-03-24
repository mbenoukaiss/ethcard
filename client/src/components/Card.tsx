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
    background-color: #a099ff;
    padding: 20px 25px;
    background-image: radial-gradient(at 83% 67%, rgb(152, 231, 156) 0, transparent 58%),
    radial-gradient(at 67% 20%, hsla(357, 94%, 71%, 1) 0, transparent 59%),
    radial-gradient(at 88% 35%, hsla(222, 81%, 65%, 1) 0, transparent 50%),
    radial-gradient(at 31% 91%, hsla(9, 61%, 61%, 1) 0, transparent 52%),
    radial-gradient(at 27% 71%, hsla(336, 91%, 65%, 1) 0, transparent 49%),
    radial-gradient(at 74% 89%, hsla(30, 98%, 65%, 1) 0, transparent 51%),
    radial-gradient(at 53% 75%, hsla(174, 94%, 68%, 1) 0, transparent 45%);
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