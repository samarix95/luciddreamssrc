import "./App.css";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import PropTypes from "prop-types";
import { Router } from "react-router-dom";

import history from "../history.js";
import { store } from "../store.js";
import setAuthToken from "../utils/setAuthToken.js";
import { SET_CURRENT_USER, SET_THEME_MODE } from "../actions/types.js";
import { setCurrLang } from '../actions/Actions.js';

import Routes from "../Routes.js";

import { useStyles, params, randomBetween } from "../styles/Styles.js";

import { fetchUserDataAction, maxSignUpSteps } from '../Config';
import { CheckTimeOut, getToken } from '../utils/CheckLoginTimeOut';
import { getUserDataError, getUserData, getUserDataPending } from '../reducers/userDataReducer.js';

import RuDict from '../dictionary/ru.js';
import EnDict from '../dictionary/en.js';

let stars = [];
let clouds = [];
let isFirstLoading = true;

if (!CheckTimeOut()) {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    store.dispatch({
        type: SET_CURRENT_USER,
        payload: null
    });
    history.push("/");
}
else {
    history.push("/luciddreams");
}

if (new Date().getHours() >= 16 || (new Date().getHours() >= 0 && new Date().getHours() < 6)) {
    store.dispatch({
        type: SET_THEME_MODE,
        palette: {
            type: "dark",
            primary: { main: "#f9a825" },
            secondary: { main: "#f50057" },
            error: { main: "#cc0000" },
        }
    });
}
else {
    store.dispatch({
        type: SET_THEME_MODE,
        palette: {
            type: "light",
            primary: { main: "#3f51b5" },
            secondary: { main: "#f50057" },
            error: { main: "#cc0000" },
        }
    });
}

function App(props) {
    const { user_data, type, userData, userDataError, userDataPending, fetchUserData, setCurrLangAction } = props;
    if (userDataError) {
        console.log("MainPage");
        console.log(userDataError);
    }
    const classes = useStyles();
    let birdStyle = {};

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

    if (type !== "light") {
        stars = [];
        for (let i = 0; i < params.amountStars; i++) {
            const size = Math.round(Math.random() * 10) === 0 ? params.size.giant : randomBetween(params.size.min, params.size.max);
            stars.push(
                <div
                    className={classes.AppStar}
                    key={i + 'appstar'}
                    style={{
                        left: randomBetween(0, 100) + "%",
                        top: randomBetween(0, 100) + "%",
                        width: size + "px",
                        height: size + "px",
                        boxShadow: "0 0 " + size + "px " + size / 2 + "px #043668",
                        animationDuration: randomBetween(params.duration.min, params.duration.max) + "s",
                    }}
                />
            );
        }
    }
    else {
        clouds = [];
        for (let i = 0; i < params.amountClouds; i++) {
            clouds.push(
                <div className={classes.AppCloud}
                    key={i + 'appcloud'}
                    style={{
                        left: '1' + (Math.random() * (50 - 30) + 30).toFixed(0) + '%',
                        top: (Math.random() * (80 - 30) + 30).toFixed(0) + '%',
                        width: '400px',
                        height: '100px',
                        transform: 'scale(' + (Math.random() * (1.6 - 0.6) + 0.6).toFixed(2) + ')',
                        opacity: '0.75',
                        animationDuration: (Math.random() * 40 + 15).toFixed(0) + 's',
                    }}
                />
            );
        }
        birdStyle = {
            left: '-10%',
            animationDuration: (Math.random() * (35 - 25) + 25).toFixed(0) + 's',
        };
    }

    React.useEffect(() => {
        if (user_data)
            fetchUserData(user_data.id, getToken());
    }, []);

    return (
        <Router history={history}>
            <div className={classes.AppDivDark}>
                <div className={classes.AppDivLight} style={type === "light" ? { opacity: 1, } : { opacity: 0, }} />
                {type === "light"
                    ? <div className={classes.AppCloudsDiv} style={type === "light" ? { opacity: 1, } : { opacity: 0, }}>
                        <div className={classes.FlockOfBirds} style={birdStyle} />
                        {clouds}
                    </div>
                    : <div className={classes.AppStarsDiv} style={type === "light" ? { opacity: 0, } : { opacity: 1, }}>
                        <div className={classes.AppComet}>
                            <div className={classes.AppCometDiv}>
                                <div className={classes.AppCometImg} />
                            </div>
                        </div>
                        {stars}
                    </div>
                }
                <div className={classes.MointainBackgroud} style={type === "light" ? { filter: 'grayscale(0%)', } : { filter: 'grayscale(100%)', }}>
                    <div className={classes.TreesBackgroud} />
                </div>
            </div>
            <Routes />
        </Router>
    );
};

App.propTypes = {
    user_data: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    userDataError: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    userDataPending: PropTypes.object.isRequired,
}

const mapStateToProps = store => {
    return {
        user_data: store.auth.user,
        type: store.themeMode.palette.type,
        userDataError: getUserDataError(store),
        userData: getUserData(store),
        userDataPending: getUserDataPending(store),
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setCurrLangAction: currLangState => dispatch(setCurrLang(currLangState)),
    fetchUserData: fetchUserDataAction,
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);