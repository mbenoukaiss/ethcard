import React from 'react';
import styled from 'styled-components';
import Flex from "../components/common/Flex";
import Presentation from "../components/home/Presentation";
import Stack from "../components/home/Stack";
import GiftCardForm from "../components/home/GiftCardForm";
import CreditCard from "../components/CreditCard";
import GiftIllustration from "../assets/gift.svg";
import {Card} from "../contracts/Contracts";
import {BsArrowRightCircleFill} from "react-icons/bs";

export const Container = styled.div`
    margin: 50px 15vw;
`;

const Hint = styled.p`
    max-width: 300px;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 5px;
`;

const Separation = styled.hr`
    margin: 75px 10vw;
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
`;

export default function Home() {
    const [card, setCard] = React.useState<Card>();

    return <Container>
        <Flex>
            <Presentation/>
            <img src={GiftIllustration} style={{width: `30%`}} alt="Gift"/>
        </Flex>
        <h1 className="mb-1 mt-6">Create a card</h1>
        <Flex row="space-between">
            <GiftCardForm liveUpdate={setCard}/>
            <BsArrowRightCircleFill size={50}/>
            <div>
                <CreditCard card={card}/>
                <Hint>
                    The beneficiary will be able to redeem their card at any time by connecting
                    to their wallet and going to the <u>Account</u> tab.
                </Hint>
            </div>
        </Flex>
        <Separation/>
        <Stack/>
    </Container>;
}
