import React from 'react';
import styled from 'styled-components';
import Flex from "../components/common/Flex";
import Presentation from "../components/home/Presentation";
import Stack from "../components/home/Stack";
import GiftCardForm from "../components/home/GiftCardForm";
import Card from "../components/home/Card";

const Container = styled.div`
    margin: 50px 15vw;
`;

export default function Home() {
    return <Container>
        <Flex>
            <Presentation/>
            <Stack/>
        </Flex>
        <Flex row="space-between" className="mt-5">
            <GiftCardForm/>
            <Card/>
        </Flex>
    </Container>;
}
