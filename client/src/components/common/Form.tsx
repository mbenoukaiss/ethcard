import React, {useState, useCallback} from 'react';

export type Fields = string | Array<string> | undefined;
export type Validator<T = any> = (value: T, field: string) => [string, string] | string | undefined;
export type Errors = { [name: string]: Array<string> };

export type FormInitializer = {
    validators?: Array<{ fields: Fields, validator: Validator }>;
    submit?: (data: any) => void;
    live?: (data: any) => void;
};

export type FormController = {
    getData: () => any;
    childChange: (name: string, value: any) => void;
    errors: Errors;
    submit: (data: any) => void;
    clearErrors: () => void;
    addError: (error: string) => void;
}

export function useValidator<T = any>(fields: Fields, validator: Validator<T>, dependencies: Array<any>) {
    return {
        fields: fields === undefined ? undefined : (Array.isArray(fields) ? fields : [fields]),
        validator: useCallback(validator, [validator, ...dependencies]),
    };
}

export function useForm(config: FormInitializer | ((data: any) => void)): FormController {
    const [data, setData] = useState<{ [key: string]: any }>({});
    const [errors, setErrors] = useState<Errors>({});

    return {
        getData: () => data,
        childChange: (name: string, value: any) => {
            const updated = {
                ...data,
                [name]: value,
            };

            setData(updated);
            if (typeof config === `object` && config.live) {
                config.live(updated);
            }
        },
        errors,
        submit: event => {
            event.preventDefault();

            const errors: Errors = {};
            if (typeof config === `object` && config.validators) {
                for (const [name, value] of Object.entries(data)) {
                    for (const validator of config.validators) {
                        if (validator.fields === undefined || validator.fields.includes(name)) {
                            const error = validator.validator(value, name);
                            if (Array.isArray(error)) {
                                if (errors[error[0]] === undefined) {
                                    errors[error[0]] = [];
                                }

                                errors[error[0]].push(error[1]);
                            } else if (error) {
                                if (errors.__general__ === undefined) {
                                    errors.__general__ = [];
                                }

                                errors.__general__.push(error);
                            }
                        }
                    }
                }
            }

            setErrors(errors);

            if (Object.keys(errors).length === 0) {
                if (typeof config === `object` && config.submit) {
                    config.submit(data);
                } else if (typeof config === `function`) {
                    config(data);
                }
            }
        },
        clearErrors: () => {
            setErrors({});
        },
        addError: (error: string) => {
            if (errors.__general__ === undefined) {
                errors.__general__ = [];
            }

            errors.__general__.push(error);
            setErrors(errors);
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
    return <form onSubmit={props.controller.submit} className={props.className}>
        {props.children}
    </form>;
}