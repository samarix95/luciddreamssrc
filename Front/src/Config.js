import axios from "axios";
import {
    fetchTagsPending, fetchTagsSuccess, fetchTagsError,
    fetchTechnicsPending, fetchTechnicsSuccess, fetchTechnicsError,
    fetchUserDataPending, fetchUserDataSuccess, fetchUserDataError,
    fetchUserPostsPending, fetchUserPostsSuccess, fetchUserPostsError,
    fetchConnectPostsPending, fetchConnectPostsSuccess, fetchConnectPostsError,
    fetchUserMapPending, fetchUserMapSuccess, fetchUserMapError
} from './actions/Actions.js';

const baseURL = "https://ldserver.herokuapp.com";

export const instance = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: { "Access-Control-Allow-Origin": "*" }
});

export function fetchTagsAction() {
    return dispatch => {
        dispatch(fetchTagsPending());
        instance.get("/gettags")
            .then(res => {
                dispatch(fetchTagsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchTagsError(error));
            });
    }
}

export function fetchTechnicsAction() {
    return dispatch => {
        dispatch(fetchTechnicsPending());
        instance.get("/gettechnics")
            .then(res => {
                dispatch(fetchTechnicsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchTechnicsError(error));
            });
    }
}

export function fetchUserDataAction(userId, userToken) {
    return dispatch => {
        dispatch(fetchUserDataPending());
        instance.post("/actions/users/getuserdata", { id: userId, token: userToken })
            .then(res => {
                dispatch(fetchUserDataSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchUserDataError(error));
            });
    }
};

export function fetchUserPostsAction(userId, userToken) {
    return dispatch => {
        dispatch(fetchUserPostsPending());
        instance.post("/actions/users/getuserposts", { id: userId, token: userToken })
            .then(res => {
                dispatch(fetchUserPostsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchUserPostsError(error));
            });
    }
};

export function fetchConnectPostsAction(userId, userToken) {
    return dispatch => {
        dispatch(fetchConnectPostsPending());
        instance.post("/actions/users/getconnectposts", { id: userId, token: userToken })
            .then(res => {
                dispatch(fetchConnectPostsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchConnectPostsError(error));
            });
    }
};

export function fetchUserMapAction(userId, userToken) {
    return dispatch => {
        dispatch(fetchUserMapPending());
        instance.post("/actions/users/getusermap", { id: userId, token: userToken })
            .then(res => {
                dispatch(fetchUserMapSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchUserMapError(error));
            });
    }
};