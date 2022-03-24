import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import Welcome from "../components/Welcome";
import Stack from "../components/Stack";

const Container = styled.div`
    flex: 1 1 auto;
    background-color: #16151c;
    background-image: radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
    radial-gradient(at 10% 20%, #3fa3d9 0, transparent 70%),
    radial-gradient(at 10% 70%, #2a99d5 0, transparent 90%),
    radial-gradient(at 90% 10%, #51b456 0, transparent 30%);
`;

const Blur = styled.div`
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    height: 100%;
`;

const App = () => {
    return (
        <Container>
            <Blur>
                <Navbar/>
                <Welcome/>
                <Stack/>
            </Blur>
        </Container>
    );
}

export default App;
