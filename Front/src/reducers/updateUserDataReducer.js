import {
    FETCH_UPDATE_USER_DATA_PENDING,
    FETCH_UPDATE_USER_DATA_SUCCESS,
    FETCH_UPDATE_USER_DATA_ERROR
} from '../actions/types.js';

const initialState = {
    success: false,
    error: null
}

export function updateUserDataReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_UPDATE_USER_DATA_PENDING:
            return {
                ...state,
                success: false
            }
        case FETCH_UPDATE_USER_DATA_SUCCESS:
            return {
                ...state,
                success: true
            }
        case FETCH_UPDATE_USER_DATA_ERROR:
            return {
                ...state,
                success: false,
                error: action.error
            }
        default:
            return state;
    }
}