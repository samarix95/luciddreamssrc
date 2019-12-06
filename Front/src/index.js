import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { store } from './store/configureStore'
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import registerServiceWorker from './registerServiceWorker'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);
registerServiceWorker()
serviceWorker.unregister();
