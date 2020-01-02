import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Router } from "react-router-dom";
import './App.css';

import history from '../history';
import { store } from "../store";
import { CheckTimeOut } from '../utils/CheckLoginTimeOut';
import setAuthToken from "../utils/setAuthToken";
import { SET_CURRENT_USER, SET_THEME_MODE } from "../actions/types";

import Routes from '../Routes';

import { useStyles, params, randomBetween } from '../styles/Styles';

let check = CheckTimeOut();
let stars = [];
let clouds = [];

if (!check) {
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
    const { type } = props;
    const classes = useStyles();
    stars = [];
    clouds = [];
    for (let i = 0; i < params.amountStars; i++) {
        let size = Math.round(Math.random() * 10) === 0
            ? params.size.giant
            : randomBetween(params.size.min, params.size.max);
        stars.push(
            <div
                className={classes.AppStar}
                key={i + 'AppStar'}
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

    for (let i = 0; i < params.amountClouds; i++) {
        let left = Math.round(Math.random() * 50 + 90);
        let top = Math.round(Math.random() * 100 / 100 * 90);
        let scale = Math.random() * 1.5 - 0.5;
        let opacity = Math.random() * 90 / 100;
        let speed = Math.random() * 30 + 15;
        clouds.push(
            <div className={classes.AppCloud}
                key={i + 'AppCloud'}
                style={{
                    left: left + '%',
                    top: top + '%',
                    width: '400px',
                    height: '100px',
                    transform: 'scale(' + scale + ')',
                    opacity: opacity,
                    animationDuration: speed + 's',
                }}
            />
        );
    }

    return (
        <Router history={history}>
            <div className={classes.AppDivDark}>
                <div className={classes.AppDivLight}
                    style={type === "light"
                        ? { opacity: 1, }
                        : { opacity: 0, }}
                />
                {type === "light"
                    ?
                    <div className={classes.AppCloudsDiv}
                        style={type === "light"
                            ? { opacity: 1, }
                            : { opacity: 0, }}
                    >
                        {clouds}
                    </div>
                    :
                    <div className={classes.AppStarsDiv}
                        style={type === "light"
                            ? { opacity: 0, }
                            : { opacity: 1, }}
                    >
                        {stars}
                    </div>
                }
            </div>
            <Routes />
        </Router>
    );
};

App.propTypes = {
    type: PropTypes.string.isRequired,
}

const mapStateToProps = store => {
    return {
        type: store.themeMode.palette.type,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);