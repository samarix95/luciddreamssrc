import "./App.css";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import { Router } from "react-router-dom";

import history from "../history.js";
import { store } from "../store.js";
import { SET_THEME_MODE } from "../actions/types.js";
import { setCurrLang } from '../actions/Actions.js';

import Routes from "../Routes.js";

import { colors } from "../styles/Styles.js";
import { fetchUserDataAction, maxSignUpSteps } from "../Config.js";
import { CheckTimeOut, getToken, removeToken } from "../utils/CheckLoginTimeOut.js";
import { getUserDataError, getUserData, getUserDataPending } from "../reducers/userDataReducer.js";

import RuDict from '../dictionary/ru.js';
import EnDict from '../dictionary/en.js';

let isFirstLoading = true;

if (CheckTimeOut()) {
    history.push("/");
}
else {
    removeToken();
    history.push("/signin");
}

if (new Date().getHours() >= 16 || (new Date().getHours() >= 0 && new Date().getHours() < 6)) {
    store.dispatch({
        type: SET_THEME_MODE,
        palette: {
            type: "dark",
            primary: { main: colors.dark.primary },
            secondary: { main: colors.dark.secondary },
            error: { main: colors.dark.error }
        }
    });
}
else {
    store.dispatch({
        type: SET_THEME_MODE,
        palette: {
            type: "light",
            primary: { main: colors.light.primary },
            secondary: { main: colors.light.secondary },
            error: { main: colors.light.error }
        }
    });
}

function App(props) {
    const { user_data, userData, userDataError, userDataPending, fetchUserData, setCurrLangAction } = props;
    
    if (typeof userData !== 'undefined') {
        if (userData.signup_step !== maxSignUpSteps && user_data.id === userData.id) {
            history.push({
                pathname: "/signup",
                defaultData: {
                    id: userData.id,
                    signup_step: userData.signup_step
                }
            });
        }
    }

    if (!userDataPending && userDataError == null && isFirstLoading) {
        userData.language === 0 ? setCurrLangAction(EnDict) : setCurrLangAction(RuDict);
        isFirstLoading = false;
    }

    React.useEffect(() => {
        if (user_data)
            fetchUserData(user_data.id, getToken());
    }, []);

    return (
        <Router history={history}>
            <Routes />
        </Router>
    )
}

App.propTypes = {
    user_data: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    userDataError: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    userDataPending: PropTypes.object.isRequired
};

const mapStateToProps = store => {
    return {
        user_data: store.auth.user,
        type: store.themeMode.palette.type,
        userDataError: getUserDataError(store),
        userData: getUserData(store),
        userDataPending: getUserDataPending(store)
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setCurrLangAction: currLangState => dispatch(setCurrLang(currLangState)),
    fetchUserData: fetchUserDataAction
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);