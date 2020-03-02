import { FETCH_CONNECT_POSTS_PENDING, FETCH_CONNECT_POSTS_SUCCESS, FETCH_CONNECT_POSTS_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    connectPosts: {},
    error: null
}

export function connectPostsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CONNECT_POSTS_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_CONNECT_POSTS_SUCCESS:
            return {
                ...state,
                pending: false,
                connectPosts: action.connectPosts
            }
        case FETCH_CONNECT_POSTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getConnectPosts = state => state.fetchConnectPosts.connectPosts.result;
export const getConnectPostsPending = state => state.fetchConnectPosts.pending;
export const getConnectPostsError = state => state.fetchConnectPosts.error;