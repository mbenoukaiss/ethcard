import React, {useEffect, useContext} from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import styled from 'styled-components';
import Navbar from './Navbar';
import Home from "../pages/Home";
import Account from "../pages/Account";
import {CardContext, CONTRACT_ADDRESS} from "../contracts/CardContext";
import {useAlert} from "react-alert";

export const ROUTE_HOME = `/`;
export const ROUTE_ACCOUNT = `/account`;

const Background = styled.div`
    display: flex;
    flex: 1 1 auto;
    background-color: #16151c;
    background-image: radial-gradient(at 0% 0%, hsl(200, 75%, 3%) 0, transparent 20%),
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

const App = () => {
    const {getProvider} = useContext(CardContext);
    const alert = useAlert();

    useEffect(() => {
        getProvider().getCode(CONTRACT_ADDRESS).then(code => {
            if (code === '0x') {
                alert.show(<>Contract not deployed on this network, please switch to
                    the <b>Ropsten network</b> and <a href="/">refresh the page</a></>, {
                    type: `error`,
                    timeout: 0,
                });
            }
        });
    }, []);


    return (
        <Router>
            <Background>
                <Blur>
                    <Navbar/>
                    <Routes>
                        <Route path={ROUTE_ACCOUNT} element={<Account/>}/>
                        <Route path={ROUTE_HOME} element={<Home/>}/>
                    </Routes>
                </Blur>
            </Background>
        </Router>
    );
}

export default App;
