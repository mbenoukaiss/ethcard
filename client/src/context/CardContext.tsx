import React from 'react';
import {ethers} from 'ethers';
import {UUID} from 'uuid-generator-ts';

import {CONTRACT_ABI, CONTRACT_ADDRESS} from "../contracts/Contracts";

export type Card = {
    number: string;
    beneficiary: string;
    amount: number;
    message: string;
}

export type CardContextProps = {
    account?: string | null;
    connectWallet: () => void;
    createCard: (data: Card) => Promise<string | null>;
    getAvailableCards: () => Promise<Array<Card>>;
    redeemCard: (cardNumber: string) => Promise<void>;
}

export const CardContext = React.createContext<CardContextProps>({
    account: undefined,
    connectWallet: () => null,
    createCard: () => Promise.resolve(null),
    getAvailableCards: () => Promise.resolve([]),
    redeemCard: () => Promise.resolve(),
});

const {ethereum} = window as any;

export type CardProviderProps = {
    children?: any;
};

export class CardProvider extends React.Component<CardProviderProps> {

    public readonly state = {
        account: undefined,
    };

    private checkEthereum(requiredLogin: boolean = false): boolean {
        return requiredLogin ? ethereum && this.state.account : Boolean(ethereum);
    }

    private static getContract() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }

    private static toBytes(input: string): Array<number> {
        if(!input) {
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

    private async connectWallet() {
        if (this.checkEthereum()) {
            await ethereum.request({method: `eth_requestAccounts`});
        }
    }

    private async createCard(data: { beneficiary: string, amount: number, message: string }): Promise<string | null> {
        if (this.checkEthereum()) {
            const contract = CardProvider.getContract();
            const uuid = UUID.getDashFreeUUID(new UUID());

            try {
                const tx = await contract.createCard(CardProvider.toBytes(uuid), data.beneficiary, data.message ?? ``, {
                    from: this.state.account,
                    value: ethers.utils.parseEther(data.amount.toString()),
                    gasLimit: ethers.utils.hexlify(500000),
                });

                console.log(tx);
            } catch (e) {
                console.error(e);
            }

            return uuid;
        }

        return null;
    }

    private async getAvailableCards(): Promise<Array<Card>> {
        if (this.checkEthereum(true)) {
            const contract = CardProvider.getContract();

            const output = [];
            const availableCards = await contract.getAvailableCards(this.state.account);

            for(const cardNumber of availableCards) {
                const card = await contract.cards(cardNumber);
                output.push({
                    number: card.number,
                    beneficiary: card.beneficiary,
                    amount: Number(ethers.utils.formatEther(card.amount)),
                    message: card.message,
                });
            }

            return output;
        }

        return [];
    }

    private async redeemCard(cardNumber: string) {
        if (this.checkEthereum(true)) {
            const contract = CardProvider.getContract();

            const tx = await contract.redeemCard(cardNumber, {
                from: this.state.account,
                gasLimit: ethers.utils.hexlify(750000),
            });

            tx.wait();
            console.log(tx);
        }
    }

    render() {
        const value = {
            account: this.state.account,
            connectWallet: this.connectWallet.bind(this),
            createCard: this.createCard.bind(this),
            getAvailableCards: this.getAvailableCards.bind(this),
            redeemCard: this.redeemCard.bind(this),
        };

        return <CardContext.Provider value={value}>
            {this.props.children}
        </CardContext.Provider>;
    }
}