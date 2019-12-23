import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import './App.css';

import history from '../history';
import MainPage from "./MainPage";
import Sign from './Sign';
import { store } from "../store";
import { CheckTimeOut } from '../utils/CheckLoginTimeOut';
import setAuthToken from "../utils/setAuthToken";
import { SET_CURRENT_USER } from "../actions/types"
import PrivateRoute from "../components/PrivateRoute";

const App = () => {
    let check = CheckTimeOut();
    if (!check) {
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