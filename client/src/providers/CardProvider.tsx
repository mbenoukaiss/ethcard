import React from 'react';
import {ethers} from 'ethers';
import {UUID} from 'uuid-generator-ts';
import {Card, CONTRACT_ABI, CONTRACT_ADDRESS} from "../contracts/CardContext";
import {CardContext} from "../contracts/CardContext";
import {Contract} from "ethers";

const {ethereum} = window as any;

type CardProviderState = {
    loading: boolean;
    provider: any;
    contract: Contract;
    account?: string;
    listeners: {[event: string]: Array<(...args: any[]) => void>};
}
export class CardProvider extends React.Component<{}, CardProviderState> {

    public state: CardProviderState;

    constructor(props: {}) {
        super(props);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

        this.state = {
            loading: true,
            provider,
            contract,
            account: undefined,
            listeners: {},
        };
    }

    private checkEthereum(requiredLogin: boolean = false): boolean {
        return ethereum && (requiredLogin ? Boolean(this.state.account) : true);
    }

    public getContract<T = Contract>(sendProvider: boolean = false): T {
        return (sendProvider ? [this.state.provider, this.state.contract] : this.state.contract) as unknown as T;
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
                this.setState({
                    account: accounts[0].toLowerCase(),
                    loading: false,
                });
            } else if (this.state.account) {
                this.setState({
                    account: undefined,
                    loading: false,
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
            return await this.getContract().getCardsCount();
        }

        return 0;
    }

    private async getCard(number: string): Promise<Card|undefined> {
        if (this.checkEthereum(true)) {
            const contract = this.getContract();
            const card = await contract.getCard(number);

            return {
                number: card.number,
                creator: card.creator.toLowerCase(),
                beneficiary: card.beneficiary.toLowerCase(),
                amount: Number(ethers.utils.formatEther(card.amount)),
                message: card.message,
                redeemedAt: card.redeemedAt,
                cancelledAt: card.cancelledAt,
            };
        }
    }

    private async getCards(fn: string): Promise<Array<Card>> {
        if (this.checkEthereum(true)) {
            const contract = this.getContract();

            const output = [];
            const availableCards = await contract[fn](this.state.account);

            for (const cardNumber of availableCards) {
                const card = await this.getCard(cardNumber);
                if(card) {
                    output.push(card);
                }
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
            const contract = this.getContract();
            const uuid = UUID.getDashFreeUUID(new UUID());

            try {
                const tx = await contract.createCard(CardProvider.toBytes(uuid), data.beneficiary, data.message ?? ``, {
                    from: this.state.account,
                    value: ethers.utils.parseEther(data.amount.toString()),
                    gasLimit: ethers.utils.hexlify(500000),
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
            const contract = this.getContract();

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
            const contract = this.getContract();

            const tx = await contract.cancelCard(cardNumber, {
                from: this.state.account,
                gasLimit: ethers.utils.hexlify(250000),
            });

            tx.wait();
            console.log(tx);
        }
    }

    private addListener(events: string|Array<string>, callback: (...args: any[]) => void) {
        if (this.checkEthereum()) {
            if(!Array.isArray(events)) {
                events = [events];
            }

            for(const event of events) {
                //register the listener on the contract if it's the first listener we add
                if (!this.state.listeners[event]) {
                    const [provider, contract] = this.getContract<[any, Contract]>(true);

                    //is the provider.once really useful ?
                    provider.once("block", () => {
                        contract.on(event, (...args: any[]) => {
                            for (const listener of this.state.listeners[event] ?? []) {
                                listener(...args);
                            }
                        });
                    });
                }

                this.setState(state => ({
                    listeners: {
                        ...state.listeners,
                        [event]: [...(state.listeners[event] ?? []), callback],
                    }
                }));
            }
        }
    }

    private removeListener(events: string|Array<string>, callback: (...args: any[]) => void) {
        if (this.checkEthereum()) {
            if(!Array.isArray(events)) {
                events = [events];
            }

            for(const event of events) {
                const listeners = [...(this.state.listeners[event] ?? [])];
                listeners.splice(listeners.indexOf(callback), 1);

                this.setState({
                    listeners: {
                        ...this.state.listeners,
                        [event]: listeners,
                    }
                });
            }
        }
    }

    render() {
        const value = {
            loading: this.state.loading,
            account: this.state.account,
            promptConnexion: this.promptConnexion.bind(this),
            getCardsCount: this.getCardsCount.bind(this),
            getCard: this.getCard.bind(this),
            getAvailableCards: this.getAvailableCards.bind(this),
            getEmittedCards: this.getEmittedCards.bind(this),
            createCard: this.createCard.bind(this),
            redeemCard: this.redeemCard.bind(this),
            cancelCard: this.cancelCard.bind(this),
            addListener: this.addListener.bind(this),
            removeListener: this.removeListener.bind(this),
        };

        return <CardContext.Provider value={value}>
            {this.props.children}
        </CardContext.Provider>;
    }
}
