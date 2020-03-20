import {
    FETCH_CREATE_USER_PENDING,
    FETCH_CREATE_USER_SUCCESS,
    FETCH_CREATE_USER_ERROR,
    RESET_CREATE_USER_ERROR
} from '../actions/types.js';

const initialState = {
    pending: true,
    newUser: {},
    error: null
}

export function createUserReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CREATE_USER_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_CREATE_USER_SUCCESS:
            return {
                ...state,
                pending: false,
                newUser: action.newUser
            }
        case FETCH_CREATE_USER_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case RESET_CREATE_USER_ERROR:
            return {
                ...state,
                pending: false,
                error: null
            }
        default:
            return state;
    }
}

export const getCreateUser = state => state.fetchCreateUser.newUser;
export const getCreateUserPending = state => state.fetchCreateUser.pending;
export const getCreateUserError = state => state.fetchCreateUser.error;