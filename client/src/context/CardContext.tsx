import React from 'react';
import {ethers} from 'ethers';
import {UUID} from 'uuid-generator-ts';

import {CONTRACT_ABI, CONTRACT_ADDRESS} from "../contracts/Contracts";

export type CardContextProps = {
    account?: string | null;
    connectWallet: () => void;
    createCard: (data: { beneficiary: string, amount: number, message: string }) => Promise<string|null>;
}

export const CardContext = React.createContext<CardContextProps>({
    account: undefined,
    connectWallet: () => {},
    createCard: () => {
        return Promise.resolve(null);
    },
});

const {ethereum} = window as any;

export type CardProviderProps = {
    children?: any;
};

export class CardProvider extends React.Component<CardProviderProps> {

    public readonly state = {
        account: undefined,
    };

    private static checkEthereum(): boolean {
        return Boolean(ethereum);
    }

    private static getContract() {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    }

    public async componentDidMount() {
        await this.initializeWallet();
    }

    private async initializeWallet(registerEvents: boolean = true) {
        if (CardProvider.checkEthereum()) {
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
        if (CardProvider.checkEthereum()) {
            await ethereum.request({method: `eth_requestAccounts`});
        }
    }

    private async createCard(data: { beneficiary: string, amount: number, message: string }): Promise<string | null> {
        if (CardProvider.checkEthereum()) {
            const contract = CardProvider.getContract();
            const uuid = UUID.getDashFreeUUID(new UUID());

            try {
                const tx = await contract.createCard(uuid, data.beneficiary, data.message, {
                    from: this.state.account,
                    value: ethers.utils.parseEther(data.amount.toString())
                });
                tx.wait();
            } catch (e) {
                console.error(e);
            }

            return uuid;
        }

        return null;
    }

    render() {
        const value = {
            account: this.state.account,
            connectWallet: this.connectWallet,
            createCard: this.createCard,
        };

        return <CardContext.Provider value={value}>
            {this.props.children}
        </CardContext.Provider>;
    }
}