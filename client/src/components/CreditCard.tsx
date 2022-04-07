import React, {useCallback} from 'react';
import {FaEthereum} from 'react-icons/fa';
import styled from 'styled-components';
import {Card} from "../contracts/CardContext";

const Container = styled.div`
    position: relative;
    width: 300px;
    height: 170px;
    border-radius: 8px;
    background-color: rgba(83, 202, 255, 0.2);
    padding: 20px 25px;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    background-image: radial-gradient(at 50% 20%, rgba(0, 177, 255, 0.2) 0, transparent 70%),
    radial-gradient(at 90% 70%, rgba(174, 78, 222, 0.2) 0, transparent 90%),
    radial-gradient(at 0% 90%, rgba(81, 131, 180, 0.2) 0, transparent 30%);
    cursor: pointer;
    transition: transform 200ms ease;
    transform-style: preserve-3d;
    will-change: transform;
`;

const Content = styled.div`
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    transition: transform 3s ease;
`;

const Hover = styled.div`
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    padding: 20px 25px;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 200ms ease;
`;

const Title = styled.h1`
    display: flex;
    align-items: center;
    font-size: 1.6rem;
    font-weight: 500;

    & :first-child {
        margin-right: 8px;
    }
`;

const Subtitle = styled.div`
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 1.0rem;
    font-weight: lighter;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
    padding: 5px 10px;
    width: 100%;
    margin-top: 12px;
    max-height: 3.4em;
`;

const Amount = styled.div`
    font-size: 1.8rem;
    font-weight: bold;
    margin-left: auto;
    width: fit-content;
`;

export type CreditCardProps = {
    card?: Card;
    subtitle?: string;
    amount?: string | number;
    className?: string;
    children?: any;
    animation?: boolean;
    onClick?: () => void;
};

const CreditCard = (props: CreditCardProps) => {
    let card = props.card ?? {
        amount: props.amount as number,
        message: props.subtitle as string,
    };

    const [transform, setTransform] = React.useState(``);
    const [hovering, setHovering] = React.useState(false);

    const THRESHOLD = 25;
    const handleHover = useCallback(function(this: any, e) {
        if(props.animation) {
            const {clientX, clientY, currentTarget} = e;
            const {clientWidth, clientHeight, offsetLeft, offsetTop} = currentTarget;

            const horizontal = (clientX - (offsetLeft - window.scrollX)) / clientWidth;
            const vertical = (clientY - (offsetTop - window.scrollY)) / clientHeight;
            const rotateX = (THRESHOLD / 2 - horizontal * THRESHOLD).toFixed(2);
            const rotateY = (vertical * THRESHOLD - THRESHOLD / 2).toFixed(2);

            setTransform(`perspective(${clientWidth}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(1, 1, 1)`);
        }

        setHovering(true);
    }, []);

    const resetStyles = useCallback(function(this: any, e) {
        setTransform(`perspective(${e.currentTarget.clientWidth}px) rotateX(0deg) rotateY(0deg)`);
        setHovering(false);
    }, []);

    return <Container style={{transform}} className={props.className} onMouseMove={handleHover} onMouseLeave={resetStyles} onClick={props.onClick}>
        <Content style={{filter: props.children && hovering ? `blur(5px)` : undefined}}>
            <div>
                <Title><FaEthereum/> Gift card</Title>
                <Subtitle hidden={!card.message}>{card.message}</Subtitle>
            </div>
            <Amount>{card.amount ?? 0} Eth</Amount>
        </Content>
        <Hover style={{opacity: !props.children || !hovering ? 0 : 1}}>
            {props.children}
        </Hover>
    </Container>
}

export default CreditCard;
