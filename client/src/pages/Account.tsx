import React from "react";
import {CardContext, CardEvent} from "../contracts/CardContext";

import {Container} from "./Home";
import {Card} from "../contracts/CardContext";
import CardList from "../components/account/CardList";

type AccountState = {
    loaded: boolean;
    availableCards: Array<Card>;
    emittedCards: Array<Card>;

    addCard: (number: string) => void;
    updateCard: (number: string) => void;
};

export default class Account extends React.Component<{}, AccountState> {

    static contextType = CardContext;

    public context!: React.ContextType<typeof CardContext>;
    public state: AccountState;

    constructor(props: {}) {
        super(props);

        this.state = {
            loaded: false,
            availableCards: [],
            emittedCards: [],
            addCard: this.addCard.bind(this),
            updateCard: this.updateCard.bind(this),
        };
    }

    private async addCard(number: string) {
        const card = await this.context.getCard(number);
        if(card) {
            const newState = {} as any;
            if (card.beneficiary === this.context.account && this.state.availableCards.findIndex(card => card.number === number) === -1) {
                newState.availableCards = [...this.state.availableCards, card];
            }

            if (card.creator === this.context.account && this.state.emittedCards.findIndex(card => card.number === number) === -1) {
                newState.emittedCards = [...this.state.emittedCards, card];
            }

            this.setState(newState);
        }
    }

    private async updateCard(number: string) {
        const card = await this.context.getCard(number);
        if(card) {
            const clonedAvailableCards = [...this.state.availableCards];
            const availableIndex = clonedAvailableCards.findIndex(c => c.number === number);
            if(availableIndex) {
                clonedAvailableCards[availableIndex] = card;
            }
            
            const clonedEmittedCards = [...this.state.emittedCards];
            const emittedIndex = clonedEmittedCards.findIndex(c => c.number === number);
            if(emittedIndex) {
                clonedEmittedCards[emittedIndex] = card;
            }

            this.setState({
                availableCards: clonedAvailableCards,
                emittedCards: clonedEmittedCards,
            });
        }
    }

    async componentDidUpdate() {
        //fetch the data once the context says it has loaded
        if(!this.context.loading) {
            this.setState({
                loaded: true,
                availableCards: await this.context.getAvailableCards(),
                emittedCards: await this.context.getEmittedCards(),
            });
        }
    }

    componentDidMount() {
        this.context.addListener([CardEvent.Redeemed, CardEvent.Cancelled], this.state.updateCard);
        this.context.addListener(CardEvent.Created, this.state.addCard);
    }

    componentWillUnmount() {
        this.context.removeListener([CardEvent.Redeemed, CardEvent.Cancelled], this.state.updateCard);
        this.context.removeListener(CardEvent.Created, this.state.addCard);
    }

    render() {
        const available = this.state.availableCards.filter(card => card.redeemedAt.eq(0) && card.cancelledAt.eq(0));
        const emitted = this.state.emittedCards.filter(card => card.redeemedAt.eq(0) && card.cancelledAt.eq(0));

        return <>
            <Container hidden={this.context.account !== undefined}>
                Please login to MetaMask first
            </Container>

            <Container hidden={!this.state.loaded}>
                <CardList cards={available}
                          title={`${available.length || `No`} card${available.length !== 1 ? `s` : ``} waiting to be redeemed`}
                          explanation="You will find the cards that have been gifted to you below. Click on the card to redeem the amount."
                          onClick={card => this.context.redeemCard(card.number)}/>

                <CardList cards={emitted}
                          title={`${emitted.length || `No`} card${emitted.length !== 1 ? `s` : ``} created by you`}
                          explanation="You will find the cards that you have created below and that have not been redeemed yet below.
                        Click on the card to cancel the emission."
                          onClick={card => this.context.cancelCard(card.number)}/>
            </Container>
        </>;
    }
}