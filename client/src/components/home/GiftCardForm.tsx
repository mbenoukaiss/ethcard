import React from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Form, {useForm} from '../common//Form';

export default function GiftCardForm() {
    const form = useForm(async data => {
        console.log(data);
    });

    return (
        <Form controller={form} className="relative">
            <Input in={form} email label="Beneficiary" name="beneficiary" placeholder="0x5e0b94...68a394" required/>
            <Input in={form} number label="Amount" name="amount" placeholder="5 ETH" required/>
            <Input in={form} textarea label="Message" name="message" placeholder="Write your message here" required/>

            <Button className="mt-1" submit>Create card</Button>
        </Form>
    );
}