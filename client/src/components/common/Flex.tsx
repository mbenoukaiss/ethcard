import React, {CSSProperties} from 'react';

const FLEX_DIRECTION = {
  horizontal: `row`,
  vertical: `column`,
};

export type FlexProps = {
  direction?: `horizontal` | `vertical`;
  row?: string;
  col?: string;
  className?: string;
  children?: any;
};

Flex.defaultProps = {
  direction: undefined,
  row: `center`,
  col: `center`,
  className: null,
  children: undefined,
};

export default function Flex(props: FlexProps) {
  let justify = props.direction === `horizontal` ? props.col : props.row;
  let align = props.direction === `horizontal` ? props.row : props.col;

  const style: CSSProperties = {
    display: `flex`,
    flexDirection: FLEX_DIRECTION[props.direction ?? `horizontal`] as `row` | `column`,
    justifyContent: justify,
    alignItems: align,
  };

  return (
    <div className={props.className} style={style}>{props.children}</div>
  )
}