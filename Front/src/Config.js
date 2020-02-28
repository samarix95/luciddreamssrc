import axios from "axios";
import { fetchTagsPending, fetchTagsSuccess, fetchTagsError, fetchTechnicsPending, fetchTechnicsSuccess, fetchTechnicsError } from './actions/Actions.js';

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
