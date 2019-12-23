import jwt_decode from "jwt-decode";

import { store } from "../store";
import setAuthToken from "../utils/setAuthToken";
import { SET_CURRENT_USER } from "../actions/types"

export function CheckTimeOut() {
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
            return false;
        }
        else {
            return true;
        }
    }
}