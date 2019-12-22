import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";

import './App.css';

import history from '../history';
import MainPage from "./MainPage";
import Sign from './Sign';
import { store } from "../store";
import { SET_CURRENT_USER } from "../actions/types"
import setAuthToken from "../utils/setAuthToken";
import PrivateRoute from "../components/PrivateRoute";

if (localStorage.jwtToken) {
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    store.dispatch({
        type: SET_CURRENT_USER,
        payload: decoded
    });

    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
        localStorage.removeItem("jwtToken");
        setAuthToken(false);
        store.dispatch({
            type: SET_CURRENT_USER,
            payload: null
        });
    }
    else {
        history.push("/luciddreams");
    }
}

const App = () => {
    return (
        <Provider store={store}>
            <Router history={history}>
                <Route exact path="/" component={Sign} />
                <Switch>
                    <PrivateRoute exact path="/luciddreams" component={MainPage} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;