import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    padding: 20px 50px;
    color: white;
    font-size: 1.4rem;
    font-weight: bold;
    background-color: #0f0e13;
    background-image: radial-gradient(at 0% 0%, hsla(253, 16%, 7%, 1) 0, transparent 50%),
    radial-gradient(at 50% 0%, hsl(225, 81%, 21%) 0, transparent 50%),
    radial-gradient(at 100% 0%, hsla(339, 49%, 30%, 1) 0, transparent 50%);
`;

const Navbar = () => {
    return <Container>Coinslots</Container>;
}

export default Navbar;
