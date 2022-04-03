import React, {useContext} from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Form, {useForm} from '../common//Form';
import {Card, CardContext} from "../../context/CardContext";

export default function GiftCardForm(props: {liveUpdate: (card: Card) => void}) {
    const {createCard} = useContext(CardContext);
    const form = useForm({
        submit: async data => await createCard(data),
        live: data => props.liveUpdate(data),
    });

    return (
        <Form controller={form} className="relative">
            <Input in={form} text label="Beneficiary" name="beneficiary" placeholder="0x5e0b94...68a394" required/>
            <Input in={form} number label="Amount" name="amount" placeholder="5 ETH" min={0} step={0.0001} required/>
            <Input in={form} text label="Message" name="message" placeholder="Write your message here" maxlength={72}/>

            <Button className="mt-1" submit>Create card</Button>
        </Form>
    );
}