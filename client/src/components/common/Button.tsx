import '../../style/components/Button.scss';

import React from 'react';

export type ButtonProps = {
  type: `primary` | `secondary` | `silent` | `link` | `dropdown` | undefined;
  big?: boolean;
  icon?: string;
  submit?: boolean;
  click?: (event: any) => void;
  className?: string;
  rf?: any;
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
            onClick={props.click}>
      {props.icon ? <img src={props.icon} alt="Button icon"/> : <></>}
      {props.children}
    </button>
  );
}