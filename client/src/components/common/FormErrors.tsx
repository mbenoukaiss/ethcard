import React from 'react';
import {FormController} from "./Form";
import styled from 'styled-components';

const Error = styled.span`
    display: inline-flex;
    align-items: center;
    color: #dc3333;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    background-color: rgba(255, 78, 78, 0.3);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: 0.5rem 1rem;

    b {
        color: #dc3333;
    }
    & :first-child {
        margin-right: 0.3rem;
    }
`;


export type FormErrorsProps = {
    in: FormController;
}

export default function FormErrors(props: FormErrorsProps) {
    const errors = props.in.errors.__general__;

    return <>
        {errors && errors.map((error, index) => <Error key={index}><b>Error :</b> {error}</Error>)}
    </>

}