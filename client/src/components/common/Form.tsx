import React, {useState} from 'react';

export type FormInitializer = {
    submit: (data: any) => void;
    live: (data: any) => void;
};

export type FormController = {
    getData: () => any;
    childChange: (name: string, value: any) => void;
    submit: (data: any) => void;
}

export function useForm(config: FormInitializer | ((data: any) => void)): FormController {
    const [data, setData] = useState<{ [key: string]: any }>({});

    return {
        getData: () => data,
        childChange: (name: string, value: any) => {
            const updated = {
                ...data,
                [name]: value,
            };

            setData(updated);
            if(typeof config === `object` && config.live) {
                config.live(updated);
            }
        },
        submit: event => {
            event.preventDefault();

            if(typeof config === `object` && config.submit) {
                config.submit(data);
            } else if(typeof config === `function`) {
                config(data);
            }
        },
    }
}

export type FormProps = {
    controller: FormController;
    className?: string;
    children?: any;

    onChange: (data: any) => void;
};

Form.defaultProps = {
    className: null,
    children: undefined,
    onChange: undefined,
}

export default function Form(props: FormProps) {
    return (
        <form onSubmit={props.controller.submit} className={props.className}>{props.children}</form>
    );
}