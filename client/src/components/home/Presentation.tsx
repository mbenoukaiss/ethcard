import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding-right: 50px;
`;

const Title = styled.h1`
    font-size: 3rem;
`;

const Explanation = styled.p`
    font-size: 1.6rem;
`;

export default function Presentation() {
    return <Container>
        <Title>Make a crypto gift</Title>
        <Explanation>
            Fill in the address of the recipient, deposit the amount you wish to gift, and on the chosen date
            the owner of the address will be able to claim their gift !
        </Explanation>
    </Container>;
}
