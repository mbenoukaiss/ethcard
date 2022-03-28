import React, {useState} from 'react';

export type FormController = {
  childChange: (name: string, value: any) => void;
  submit: (data: any) => void;
}

export function useForm(submit: (data: any) => void): FormController {
  const [data, setData] = useState<{ [key: string]: any }>({});

  return {
    childChange: (name: string, value: any) => {
      setData({
        ...data,
        [name]: value,
      })
    },
    submit: event => {
      event.preventDefault();
      submit(data);
    },
  }
}

export type FormProps = {
  controller: FormController;
  className?: string;
  children?: any;
};

Form.defaultProps = {
  className: null,
  children: undefined,
}

export default function Form(props: FormProps) {
  return (
    <form onSubmit={props.controller.submit} className={props.className}>{props.children}</form>
  );
}