import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.scss';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {CardProvider} from "./providers/CardProvider";
import {Provider as AlertProvider} from "react-alert";
import AlertTemplate, {options} from "./components/utils/AlertTemplate";

ReactDOM.render(
    <React.StrictMode>
        <AlertProvider template={AlertTemplate} {...options}>
            <CardProvider>
                <App/>
            </CardProvider>
        </AlertProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
