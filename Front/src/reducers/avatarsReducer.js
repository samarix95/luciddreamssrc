import {
    FETCH_AVATARS_PENDING,
    FETCH_AVATARS_SUCCESS,
    FETCH_AVATARS_ERROR
} from '../actions/types.js';

const initialState = {
    pending: true,
    avatars: {},
    error: null
}

export function avatarsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_AVATARS_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_AVATARS_SUCCESS:
            return {
                ...state,
                pending: false,
                avatars: action.avatars
            }
        case FETCH_AVATARS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getAvatars = state => state.fetchAvatars.avatars;
export const getAvatarsPending = state => state.fetchAvatars.pending;
export const getAvatarsError = state => state.fetchAvatars.error;