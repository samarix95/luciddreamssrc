import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <div id='global' style={{
        overflow: 'auto',
        height: '100%',
        position: 'relative',
    }}>
        <App />
    </div>
    , document.getElementById('root')
);

serviceWorker.unregister();
