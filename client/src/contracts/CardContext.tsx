import React from 'react';
import ABI from "./Cards.json";
import {BigNumber} from "ethers";

export const CONTRACT_ADDRESS: string = `0x048a8198d33Bcd0D368d1fD3019d15B1Fed4ea90`;
export const CONTRACT_ABI: any = ABI.abi;

export type Card = {
    number: string;
    creator: string;
    beneficiary: string;
    amount: number;
    message: string;
    redeemedAt: BigNumber;
    cancelledAt: BigNumber;
};

export type CardContextProps = {
    loading: boolean;
    account?: string | null;
    promptConnexion: () => void;
    getCardsCount: () => Promise<number>;
    getCard: (number: string) => Promise<Card|undefined>;
    getAvailableCards(): Promise<Array<Card>>;
    getEmittedCards(): Promise<Array<Card>>;
    createCard: (data: Card) => Promise<string | null>;
    redeemCard: (cardNumber: string) => Promise<void>;
    cancelCard: (cardNumber: string) => Promise<void>;
    addListener: (events: string|Array<string>, listener: (...args: any[]) => void) => void;
    removeListener: (events: string|Array<string>, listener: (...args: any[]) => void) => void;
}

export const CardContext = React.createContext<CardContextProps>({
    loading: true,
    account: undefined,
    promptConnexion: () => null,
    getCardsCount: () => Promise.resolve(0),
    getCard: () => Promise.resolve(undefined),
    getAvailableCards: () => Promise.resolve([]),
    getEmittedCards: () => Promise.resolve([]),
    createCard: () => Promise.resolve(null),
    redeemCard: () => Promise.resolve(),
    cancelCard: () => Promise.resolve(),
    addListener: () => null,
    removeListener: () => null,
});

export enum CardEvent {
    Created = `CreateCard`,
    Redeemed = `RedeemedCard`,
    Cancelled = `CancelledCard`,
}
