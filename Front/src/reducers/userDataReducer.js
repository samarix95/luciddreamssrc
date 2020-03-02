import { FETCH_USER_DATA_PENDING, FETCH_USER_DATA_SUCCESS, FETCH_USER_DATA_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    userData: {},
    error: null
}

export function userDataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_DATA_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_USER_DATA_SUCCESS:
            return {
                ...state,
                pending: false,
                userData: action.userData
            }
        case FETCH_USER_DATA_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getUserData = state => state.fetchUserData.userData.result;
export const getUserDataPending = state => state.fetchUserData.pending;
export const getUserDataError = state => state.fetchUserData.error;