import React from 'react';
import styled from 'styled-components';
import Navbar from './Navbar';
import Presentation from "./home/Presentation";
import Stack from "./home/Stack";
import Flex from "./common/Flex";
import Card from "./home/Card";
import GiftCardForm from "./home/GiftCardForm";

const Background = styled.div`
    display: flex;
    flex: 1 1 auto;
    background-color: #16151c;
    background-image: radial-gradient(at 0% 0%, hsl(153, 100%, 20%) 0, transparent 20%),
    radial-gradient(at 10% 30%, #00266c 0, transparent 70%),
    radial-gradient(at 60% 80%, #004462 0, transparent 60%),
    radial-gradient(at 90% 10%, #480057 0, transparent 30%),
    radial-gradient(at 110% 30%, #480057 0, transparent 30%);
`;

const Blur = styled.div`
    flex: 1 1 auto;
    background-color: rgba(255, 255, 255, 0.025);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
`;

const Container = styled.div`
    margin: 50px 15vw;
`;

const App = () => {
    return (
        <Background>
            <Blur>
                <Navbar/>
                <Container>
                    <Flex>
                        <Presentation/>
                        <Stack/>
                    </Flex>
                    <Flex row="space-between" className="mt-5">
                        <GiftCardForm/>
                        <Card/>
                    </Flex>
                </Container>
            </Blur>
        </Background>
    );
}

export default App;
