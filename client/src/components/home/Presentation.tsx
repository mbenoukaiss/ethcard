import React, {useEffect, useState, useContext} from 'react';
import styled from 'styled-components';
import {useSpring, animated} from 'react-spring';
import {CardContext} from "../../contracts/CardContext";

const Container = styled.div`
    padding-right: 50px;
`;

const Title = styled.h1`
    font-size: 3rem;
`;

const Explanation = styled.div`
    font-size: 1.6rem;
`;

const Uses = styled.p`
    margin-top: 1rem;
    font-weight: bold;
    font-size: 1.3rem;
`;

export default function Presentation() {
    const {getCardsCount} = useContext(CardContext);
    const [cardCount, setCardCount] = useState(0);

    useEffect(() => {
        getCardsCount().then(setCardCount);
    }, [getCardsCount, setCardCount]);

    const props = useSpring({count: cardCount, from: {count: 0}});

    return <Container>
        <Title>Make a crypto gift</Title>
        <Explanation>
            Fill in the address of the recipient, deposit the amount you wish to gift, and on the chosen date
            the owner of the address will be able to claim their gift !
            <Uses hidden={!cardCount}>
                More than <animated.span className="number">{props.count.to(count => Math.round(count))}</animated.span> cards have been created using this service
            </Uses>
        </Explanation>
    </Container>;
}
