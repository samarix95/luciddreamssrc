import React from 'react';
import { Router, Route } from "react-router-dom";
import history from "../history";
import './App.css';
import UserProvider from '../contexts/UserProvider';
import MainPage from "./MainPage";

const App = () => {

    return (
        <Router history={history}>
            <UserProvider>
                <Route path="/" component={MainPage} />
            </UserProvider>
        </Router >
    );
};

export default App;