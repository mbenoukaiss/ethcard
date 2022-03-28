import React from 'react';
import styled from 'styled-components';
import {AiOutlineLoading} from 'react-icons/ai';

const Container = styled.div`
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(1px);
    border-radius: 5px;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export default function Loader() {
    return <Container>
        <AiOutlineLoading size={32} className="icon-spin"/>
    </Container>;
}
