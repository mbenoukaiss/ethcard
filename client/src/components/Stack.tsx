import React from 'react';
import {FaEthereum, FaReact, FaFileContract} from 'react-icons/fa';
import {SiSolidity} from 'react-icons/si';
import {MdWeb} from 'react-icons/md';
import styled from 'styled-components';

const Container = styled.div`
    width: 200px;
    margin-top: 50px;
    margin-left: 15vw;
    padding: 3px 12px;
    border-left: 3px solid rgba(255, 255, 255, 0.25);
`;

const Title = styled.h1`
    font-weight: bold;
    font-size: 1.2rem;
    margin-bottom: 8px;
`;

const Item = styled.span`
    display: flex;
    align-items: center;
    font-size: 1.1rem;

    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: 8px 18px;
    margin: 5px 0;
    width: fit-content;
    border-radius: 2px;

    & :first-child {
        margin-right: 5px;
    }
`;

const Stack = () => {
    return <Container>
        <Title>Technical stack</Title>
        <Item><FaEthereum/> Ethereum</Item>
        <Item><FaFileContract/> Smart contracts</Item>
        <Item><FaReact/> React</Item>
        <Item><MdWeb/> Web 3.0</Item>
        <Item><SiSolidity/> Solidity</Item>
    </Container>
}

export default Stack;
