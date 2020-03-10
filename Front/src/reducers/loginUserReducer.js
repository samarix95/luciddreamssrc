import {
    FETCH_LOGIN_USER_PENDING,
    FETCH_LOGIN_USER_SUCCESS,
    FETCH_LOGIN_USER_ERROR,
    RESET_LOGIN_USER_ERROR
} from '../actions/types.js';

const initialState = {
    pending: true,
    user: {},
    error: null
}

export function loginUserReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_LOGIN_USER_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_LOGIN_USER_SUCCESS:
            return {
                ...state,
                pending: false,
                user: action.user
            }
        case FETCH_LOGIN_USER_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case RESET_LOGIN_USER_ERROR:
            return {
                ...state,
                pending: false,
                error: null
            }
        default:
            return state;
    }
}

export const getLoginUser = state => state.fetchLoginUser.user;
export const getLoginUserPending = state => state.fetchLoginUser.pending;
export const getLoginUserError = state => state.fetchLoginUser.error;