import {
    FETCH_UPDATE_USER_DATA_PENDING,
    FETCH_UPDATE_USER_DATA_SUCCESS,
    FETCH_UPDATE_USER_DATA_ERROR,
    RESET_UPDATE_USER_DATA_ERROR,
    RESET_UPDATE_USER_DATA
} from '../actions/types.js';

const initialState = {
    success: false,
    data: {},
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
                success: true,
                data: action.data
            }
        case FETCH_UPDATE_USER_DATA_ERROR:
            return {
                ...state,
                success: false,
                error: action.error
            }
        case RESET_UPDATE_USER_DATA_ERROR:
            return {
                ...state,
                success: false,
                error: null
            }
        case RESET_UPDATE_USER_DATA:
            return {
                ...state,
                success: false,
                data: {}
            }
        default:
            return state;
    }
}

export const getUpdateUserData = state => state.fetchUpdateUserData.data;
export const getUpdateUserDataError = state => state.fetchUpdateUserData.error;