import React from 'react';
import styled from 'styled-components';
import Card from "./Card";

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 50px 15vw;
`;

const Presentation = styled.div`
    width: 600px;
`;

const Title = styled.h1`
    font-size: 3rem;
`;

const Explanation = styled.p`
    font-size: 1.6rem;
`;

const Welcome = () => {
    return <Container>
        <Presentation>
            <Title>Make a crypto gift</Title>
            <Explanation>
                Fill in the address of the recipient, deposit the amount you wish to gift, and on the chosen date
                the owner of the address will be able to claim their gift !
            </Explanation>
        </Presentation>
        <Card amount="???"/>
    </Container>;
}

export default Welcome;
