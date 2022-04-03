import ABI from './Cards.json';

export const CONTRACT_ADDRESS: string = `0x7dF1b3f190b495E88a0E58cb654F6e1D4a3a4893`;
export const CONTRACT_ABI: any = ABI.abi;

export type Card = {
    number: string;
    beneficiary: string;
    amount: number;
    message: string;
    redeemedAt: number;
    cancelledAt: number;
};