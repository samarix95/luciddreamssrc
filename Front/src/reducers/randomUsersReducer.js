import { FETCH_RANDOM_USERS_PENDING, FETCH_RANDOM_USERS_SUCCESS, FETCH_RANDOM_USERS_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    randomUsers: {},
    error: null
}

export function randomUsersReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_RANDOM_USERS_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_RANDOM_USERS_SUCCESS:
            return {
                ...state,
                pending: false,
                randomUsers: action.randomUsers
            }
        case FETCH_RANDOM_USERS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getRandomUsers = state => state.fetchRandomUsers.randomUsers.result;
export const getRandomUsersPending = state => state.fetchRandomUsers.pending;
export const getRandomUsersError = state => state.fetchRandomUsers.error;