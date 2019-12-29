import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

import { Provider } from "react-redux";
import { store } from "./store";

ReactDOM.render(
    <div id='global'
        style={{
            overflow: 'auto',
            height: '100%',
            position: 'relative',
        }}
    >

        <Provider store={store}>
            <App />
        </Provider>
    </div>
    , document.getElementById('root')
);

serviceWorker.unregister();

