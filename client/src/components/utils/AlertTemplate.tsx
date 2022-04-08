import {transitions, positions} from "react-alert";
import {AiFillInfoCircle, AiFillCheckCircle, AiFillExclamationCircle, AiFillCloseCircle} from "react-icons/ai";

export const options = {
    position: positions.TOP_CENTER,
    timeout: 5000,
    offset: `30px`,
    transition: transitions.SCALE
};

const alertStyle = {
    backgroundColor: `#151515`,
    color: `white`,
    padding: `15px`,
    borderRadius: `3px`,
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    boxShadow: `0px 2px 2px 2px rgba(0, 0, 0, 0.03)`,
    fontFamily: `Arial`,
    width: `450px`,
    boxSizing: `border-box`
}

const messageStyle = {
    paddingLeft: `1.5rem`,
    flex: 2,
}

const buttonStyle = {
    marginLeft: `20px`,
    border: `none`,
    backgroundColor: `transparent`,
    cursor: `pointer`,
    color: `#FFFFFF`
}

export default function AlertTemplate({ message, options, style, close }: any) {
    return (
        <div style={{ ...alertStyle, ...style }}>
            {options.type === `info` && <AiFillInfoCircle size={20}/>}
            {options.type === `success` && <AiFillCheckCircle size={20}/>}
            {options.type === `error` && <AiFillExclamationCircle size={20}/>}
            <span style={messageStyle}>{message}</span>
            <button onClick={close} style={buttonStyle}>
                <AiFillCloseCircle/>
            </button>
        </div>
    )
}
