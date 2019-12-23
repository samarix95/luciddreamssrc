import axios from "axios";


export const instance = axios.create({
    baseURL: 'https://ldserver.herokuapp.com',
    timeout: 10000,
    headers: { "Access-Control-Allow-Origin": "*" }
});