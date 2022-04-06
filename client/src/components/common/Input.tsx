import React from 'react';
import {FormController} from './Form';
import styled from 'styled-components';
import {AiFillWarning} from 'react-icons/ai';

const StyledLabel = styled.div`
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    margin-bottom: 7px;
    padding: 0 1.5rem;
    min-width: 400px;
    font-weight: bold;

    &[data-error] {
        background-color: rgba(255, 78, 78, 0.3);
    }

    span:first-child {
        display: inline-block;
        font-size: 1.0rem;
        margin-right: 1rem;
        padding: 0.5rem 0 0;
    }
`;

const StyledInput = styled.input`
    border: none;
    background: none;
    color: white;
    padding: 1rem 0;
    font-size: 1rem;
    width: 100%;
    outline: none;

    &::placeholder {
        color: #DDD;
        font-style: italic;
    }
`;

const StyledTextarea = styled.textarea`
    display: block;
    background: none;
    border: none;
    color: white;
    padding: 1rem 0;
    font-size: 1rem;
    width: 100%;
    outline: none;
    resize: none;

    &::placeholder {
        color: #DDD;
        font-style: italic;
    }
`;

const Error = styled.span`
    display: inline-flex;
    align-items: center;
    color: #dc3333;
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
    
    & :first-child {
        margin-right: 0.3rem;
    }
`;

export type InputProps = {
    text?: boolean;
    number?: boolean;
    email?: boolean;
    password?: boolean;
    textarea?: boolean;

    in?: FormController;
    label: string | undefined;
    name: string | undefined;
    placeholder?: string;
    required?: boolean;
    value?: any;
    min?: number;
    max?: number;
    step?: number;
    maxlength?: number;
    rows?: number;

    onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    formChange?: (name: string, value: any) => void;
};

export default class Input extends React.Component<InputProps> {

    private static defaultProps: InputProps = {
        in: undefined,
        text: false,
        number: false,
        email: false,
        password: false,
        textarea: false,

        label: undefined,
        name: undefined,
        placeholder: undefined,
        required: false,
        value: undefined,
        min: undefined,
        max: undefined,
        step: undefined,
        rows: undefined,

        onInput: undefined,
        formChange: undefined,
    };

    public readonly state: any;
    private readonly type: string | undefined;

    constructor(props: InputProps) {
        super(props);

        this.state = {
            value: props.value,
        };

        if (this.props.text) {
            this.type = `text`;
        } else if (this.props.number) {
            this.type = `number`;
        } else if (this.props.email) {
            this.type = `email`;
        } else if (this.props.password) {
            this.type = `password`;
        }

        if (this.props.value && this.props.in) {
            this.props.in.childChange(this.props.name as string, this.props.value);
        }
    }

    public getValue(): any {
        return this.state.value;
    }

    public setValue(value: any) {
        this.setState({
            value
        });

        if (this.props.in) {
            this.props.in.childChange(this.props.name as string, value);
        }
    }

    render() {
        const errors = this.props.in ? this.props.in.errors[this.props.name as string] : undefined;

        let input;
        if (this.props.textarea) {
            input = (
                <StyledTextarea name={this.props.name}
                                placeholder={this.props.placeholder}
                                rows={this.props.rows}
                                onChange={event => this.setValue(event.target.value)}
                                required={this.props.required}>
                    {this.state.value}
                </StyledTextarea>
            );
        } else {
            input = <StyledInput type={this.type}
                                 name={this.props.name}
                                 placeholder={this.props.placeholder}
                                 value={this.state.value || ``}
                                 min={this.props.min}
                                 max={this.props.max}
                                 step={this.props.step}
                                 maxLength={this.props.maxlength}
                                 onInput={this.props.onInput}
                                 onChange={event => this.setValue(event.target.value)}
                                 required={this.props.required}/>;
        }

        return (
            <StyledLabel data-error={errors ? `has-error` : undefined}>
                <span>{this.props.label}</span>
                {input}
                {errors && errors.map((error, index) => <Error key={index}><AiFillWarning style={{fill: `#dc3333`}}/> {error}</Error>)}
            </StyledLabel>
        );
    }
}

