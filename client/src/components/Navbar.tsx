import React from 'react';
import styled from 'styled-components';
import Button from "./common/Button";

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 20px 50px;
`;

const Logo = styled.div`
    font-size: 1.4rem;
    font-weight: bold;
    margin-right: 2em;
`;

const NavbarItemText = styled.span`
    display: inline-block;
    margin-right: 1em;
    cursor: pointer;
    border-bottom: 1px solid transparent;
    transition: border-bottom-color 200ms ease-in-out;
    
    &:hover {
        border-bottom-color: #FFF;
    }
`;

const NavbarItem = (props: {title: string}) => {
    return <NavbarItemText>{props.title}</NavbarItemText>
}

const Navbar = () => {
    const items = [
        "Try your luck",
        "Leaderboard",
    ];

    return <Container>
        <Logo>Coinslots</Logo>
        {items.map((item, i) => <NavbarItem key={i} title={item}/>)}
        <Button type="primary" className="ml-auto white-glassmorphism">Login</Button>
    </Container>;
}

export default Navbar;
