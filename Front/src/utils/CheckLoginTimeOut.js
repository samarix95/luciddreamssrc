import jwt_decode from "jwt-decode";
import { store } from "../store";

import setAuthToken from "../utils/setAuthToken";
import { SET_CURRENT_USER } from "../actions/types";

export function CheckTimeOut() {
    if (localStorage.jwtToken) {
        const token = localStorage.jwtToken;
        setAuthToken(token);
        store.dispatch({
            type: SET_CURRENT_USER,
            payload: jwt_decode(token)
        });
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000; // to get in seconds
        if (currentTime < decoded.exp) {
            return true;
        }
        else {
            return false;
        }
    }
}

export function getToken() {
    if (localStorage.jwtToken) {
        return localStorage.jwtToken;
    }
    else {
        return false;
    }
}

export function setToken(token) {
    localStorage.setItem("jwtToken", token);
    setAuthToken(token);
    const decode = jwt_decode(token);
    store.dispatch({
        type: SET_CURRENT_USER,
        payload: decode
    });
    return decode.id;
}

export function removeToken() {
    localStorage.removeItem("jwtToken");
    setAuthToken(false);
    store.dispatch({
        type: SET_CURRENT_USER,
        payload: null
    });
}