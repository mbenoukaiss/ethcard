import React, {useContext} from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Form, {useForm, useValidator} from '../common//Form';
import {CardContext} from "../../contracts/CardContext";
import {Card} from "../../contracts/CardContext";
import {ethers} from "ethers";
import {ERROR_MESSAGES} from "../../providers/CardProvider";
import FormErrors from "../common/FormErrors";
import {useAlert} from "react-alert";

export default function GiftCardForm(props: {liveUpdate: (card: Card) => void}) {
    const alert = useAlert();
    const verifyAddress = useValidator<string>(`beneficiary`, (address: string) => {
        if(!ethers.utils.isAddress(address)) {
            return [`beneficiary`, `Invalid ethereum address`];
        }
    }, []);

    const {createCard} = useContext(CardContext);
    const form = useForm({
        validators: [verifyAddress],
        submit: async data => {
            try {
                alert.show(<>Your card is being created and will show up shortly in the <u>Account</u> tab</>);
                await createCard(data);
            } catch (e: any) {
                form.clearErrors();
                form.addError(ERROR_MESSAGES[e.code]);
            }
        },
        live: data => props.liveUpdate(data),
    });

    return (
        <Form controller={form} className="relative">
            <Input in={form} text label="Beneficiary" name="beneficiary" placeholder="0x5e0b94...68a394" required/>
            <Input in={form} number label="Amount" name="amount" placeholder="5 ETH" min={0} step={0.0001} required/>
            <Input in={form} text label="Message" name="message" placeholder="Write your message here" maxlength={72}/>

            <FormErrors in={form}/>
            <Button className="mt-1" submit>Create card</Button>
        </Form>
    );
}