import React, {useContext} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import Button from "./common/Button";
import {CardContext} from "../context/CardContext";
import {ROUTE_HOME, ROUTE_ACCOUNT} from "./App";

const Container = styled.div`
    display: flex;
    align-items: center;
    padding: 40px 90px;
`;

const Logo = styled.div`
    display: inline-block;
    font-size: 1.6rem;
    font-weight: bold;
    margin-right: 2em;
`;

const NavbarItem = styled.span`
    display: inline-block;
    margin-right: 1em;
    cursor: pointer;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    transition: border-bottom-color 200ms ease-in-out;
    
    &:hover {
        border-bottom-color: #FFF;
    }
`;

const Navbar = () => {
    const {account, promptConnexion} = useContext(CardContext);

    return <Container hidden>
        <Link to={ROUTE_HOME}><Logo>Ethcard</Logo></Link>
        <Link to={ROUTE_ACCOUNT}><NavbarItem>Account</NavbarItem></Link>

        <Button type="primary" className="ml-auto white-glassmorphism" click={promptConnexion}>
            {account ? `Connected (${account})` : `Connect Wallet`}
        </Button>
    </Container>;
}

export default Navbar;
