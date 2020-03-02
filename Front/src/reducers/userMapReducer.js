import { FETCH_USER_MAP_PENDING, FETCH_USER_MAP_SUCCESS, FETCH_USER_MAP_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    userMap: {},
    error: null
}

export function userMapReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_MAP_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_USER_MAP_SUCCESS:
            return {
                ...state,
                pending: false,
                userMap: action.userMap
            }
        case FETCH_USER_MAP_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getUserMap = state => state.fetchUserMap.userMap.result;
export const getUserMapPending = state => state.fetchUserMap.pending;
export const getUserMapError = state => state.fetchUserMap.error;