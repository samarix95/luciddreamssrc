import React from 'react';
import io from 'socket.io-client'
import { Router, Route } from "react-router-dom";
import history from "../history";
import './App.css';
import UserProvider from '../contexts/UserProvider';
import MainPage from "./MainPage";
import OAuth from './OAuth'
const socket = io('http://localhost:3001/')

const App = () => {
    return (
        <div>
            <OAuth
                provider={'vk'}
                key={'vk'}
                socket={socket}
            />
        </div>
        // <Router history={history}>
        //     <UserProvider>
        //         <Route path="/" component={MainPage} />
        //     </UserProvider>
        // </Router >
    );
};

export default App;