import React from 'react';
import {FaEthereum, FaReact, FaFileContract} from 'react-icons/fa';
import {SiSolidity} from 'react-icons/si';
import {GiFox} from 'react-icons/gi';
import {MdWeb, MdOutlineLoop} from 'react-icons/md';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    min-width: 200px;
    padding: 3px 16px;
`;

const Item = styled.span`
    display: flex;
    align-items: center;
    font-size: 1.2rem;

    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: 12px 24px;
    width: fit-content;
    border-radius: 2px;
    margin: 5px;

    & :first-child {
        margin-right: 10px;
    }
`;

const Stack = () => {
    return <div>
        <h1 className="mb-1">Technical stack</h1>
        <Container>
            <Item><FaEthereum/> Ethereum</Item>
            <Item><FaFileContract/> Smart contracts</Item>
            <Item><FaReact/> React</Item>
            <Item><MdWeb/> Web 3.0</Item>
            <Item><SiSolidity/> Solidity</Item>
            <Item><GiFox/> MetaMask</Item>
            <Item><MdOutlineLoop/> Continuous integration</Item>
        </Container>
    </div>
}

export default Stack;
