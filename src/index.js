import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";

import App from './components/App.js';
import { store } from "./store.js";

ReactDOM.render(
    <div id='global' >
        <Provider store={store}>
            <App />
        </Provider>
    </div>
    , document.getElementById('root')
);

serviceWorker.unregister();

