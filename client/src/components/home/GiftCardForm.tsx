import React, {useContext, useState} from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Form, {useForm} from '../common//Form';
import {CardContext} from "../../context/CardContext";

export default function GiftCardForm() {
    const [createdCard, setCreatedCard] = useState<string|null>();
    const {createCard} = useContext(CardContext);
    const form = useForm(async data => {
        const card = await createCard(data);
        setCreatedCard(card);
    });

    return (
        <Form controller={form} className="relative">
            <Input in={form} text label="Beneficiary" name="beneficiary" placeholder="0x5e0b94...68a394" required/>
            <Input in={form} number label="Amount" name="amount" placeholder="5 ETH" required/>
            <Input in={form} textarea label="Message" name="message" placeholder="Write your message here" required/>

            <span hidden={!createdCard}>Created card : {createdCard}</span>
            <Button className="mt-1" submit>Create card</Button>
        </Form>
    );
}