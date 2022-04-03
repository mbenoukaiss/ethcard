import React from 'react';
import {ethers} from 'ethers';
import {UUID} from 'uuid-generator-ts';

import {CONTRACT_ABI, CONTRACT_ADDRESS, Card} from "../contracts/Contracts";

const {ethereum} = window as any;

export type CardContextProps = {
    account?: string | null;
    promptConnexion: () => void;
    getCardsCount: () => Promise<number>;
    getAvailableCards: () => Promise<Array<Card>>;
    getEmittedCards: () => Promise<Array<Card>>;
    createCard: (data: Card) => Promise<string | null>;
    redeemCard: (cardNumber: string) => Promise<void>;
    cancelCard: (cardNumber: string) => Promise<void>;
}

export const CardContext = React.createContext<CardContextProps>({
    account: undefined,
    promptConnexion: () => null,
    getCardsCount: () => Promise.resolve(0),
    getAvailableCards: () => Promise.resolve([]),
    getEmittedCards: () => Promise.resolve([]),
    createCard: () => Promise.resolve(null),
    redeemCard: () => Promise.resolve(),
    cancelCard: () => Promise.resolve(),
});

export class CardProvider extends React.Component<any> {

    public readonly state = {
        account: undefined,
    };

    private checkEthereum(requiredLogin: boolean = false): boolean {
        return ethereum && (requiredLogin ? Boolean(this.state.account) : true);
    }

    private static getContract() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }

    private static toBytes(input: string): Array<number> {
        if (!input) {
            return [];
        }

        const bytes = [];
        for (let i = 0; i < input.length; i++) {
            bytes.push(input.charCodeAt(i));
        }

        return bytes;
    }

    public async componentDidMount() {
        await this.initializeWallet();
    }

    private async initializeWallet(registerEvents: boolean = true) {
        if (this.checkEthereum()) {
            const accounts = await ethereum.request({method: `eth_accounts`});
            if (accounts.length) {
                console.log(`Connected account`);
                this.setState({
                    account: accounts[0],
                });
            } else if (this.state.account) {
                console.warn(`No accounts found`);
                this.setState({
                    account: undefined,
                });
            }

            if (registerEvents) {
                ethereum.on(`accountsChanged`, async () => {
                    await this.initializeWallet(false);
                });
            }
        }
    }

    private async promptConnexion() {
        if (this.checkEthereum()) {
            await ethereum.request({method: `eth_requestAccounts`});
        }
    }

    private async getCardsCount(): Promise<number> {
        if (this.checkEthereum()) {
            return await CardProvider.getContract().getCardsCount();
        }

        return 0;
    }

    private async getCards(fn: string): Promise<Array<Card>> {
        if (this.checkEthereum(true)) {
            const contract = CardProvider.getContract();

            const output = [];
            const availableCards = await contract[fn](this.state.account);

            for (const cardNumber of availableCards) {
                const card = await contract.getCard(cardNumber);
                output.push({
                    number: card.number,
                    beneficiary: card.beneficiary,
                    amount: Number(ethers.utils.formatEther(card.amount)),
                    message: card.message,
                    redeemedAt: card.redeemedAt,
                    cancelledAt: card.cancelledAt,
                });
            }

            return output;
        }

        return [];
    }

    private async getAvailableCards(): Promise<Array<Card>> {
        return this.getCards(`getAvailableCards`);
    }

    private async getEmittedCards(): Promise<Array<Card>> {
        return this.getCards(`getEmittedCards`);
    }

    private async createCard(data: { beneficiary: string, amount: number, message: string }): Promise<string | null> {
        if (this.checkEthereum()) {
            const contract = CardProvider.getContract();
            const uuid = UUID.getDashFreeUUID(new UUID());

            try {
                const tx = await contract.createCard(CardProvider.toBytes(uuid), data.beneficiary, data.message ?? ``, {
                    from: this.state.account,
                    value: ethers.utils.parseEther(data.amount.toString()),
                    gasLimit: ethers.utils.hexlify(250000),
                });

                tx.wait();
                console.log(tx);
            } catch (e) {
                console.error(e);
            }

            return uuid;
        }

        return null;
    }

    private async redeemCard(cardNumber: string) {
        if (this.checkEthereum(true)) {
            const contract = CardProvider.getContract();

            const tx = await contract.redeemCard(cardNumber, {
                from: this.state.account,
                gasLimit: ethers.utils.hexlify(250000),
            });

            tx.wait();
            console.log(tx);
        }
    }

    private async cancelCard(cardNumber: string) {
        if (this.checkEthereum(true)) {
            const contract = CardProvider.getContract();

            const tx = await contract.cancelCard(cardNumber, {
                from: this.state.account,
                gasLimit: ethers.utils.hexlify(250000),
            });

            tx.wait();
            console.log(tx);
        }
    }

    render() {
        const value = {
            account: this.state.account,
            promptConnexion: this.promptConnexion.bind(this),
            getCardsCount: this.getCardsCount.bind(this),
            getAvailableCards: this.getAvailableCards.bind(this),
            getEmittedCards: this.getEmittedCards.bind(this),
            createCard: this.createCard.bind(this),
            redeemCard: this.redeemCard.bind(this),
            cancelCard: this.cancelCard.bind(this),
        };

        return <CardContext.Provider value={value}>
            {this.props.children}
        </CardContext.Provider>;
    }
}