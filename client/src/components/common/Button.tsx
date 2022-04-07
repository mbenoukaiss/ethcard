import '../../style/components/Button.scss';

import React from 'react';

export type ButtonType = `primary` | `secondary` | `success` | `danger` | `silent` | `link` | `dropdown` | undefined;

export type ButtonProps = {
  type: ButtonType;
  big?: boolean;
  icon?: string;
  submit?: boolean;
  onClick?: (event: any) => void;
  className?: string;
  rf?: any;
  hidden?: boolean;
  children?: any;
};

Button.defaultProps = {
  type: `primary`,
  big: false,
  icon: null,
  submit: false,
  click: null,
  className: null,
  rf: null,
  hidden: false,
  children: null,
};

export default function Button(props: ButtonProps): JSX.Element {
  const classes = [
    props.big ? `big` : null,
    props.icon ? `icon` : null,
    props.icon && !props.children ? `icon-only` : null,
    props.className
  ].join(` `);

  return (
    <button ref={props.rf}
            className={`component-button ${props.type} ${classes}`}
            type={props.submit ? `submit` : `button`}
            style={{display: props.hidden ? `none` : undefined}}
            onClick={props.onClick}>
      {props.icon ? <img src={props.icon} alt="Button icon"/> : <></>}
      {props.children}
    </button>
  );
}