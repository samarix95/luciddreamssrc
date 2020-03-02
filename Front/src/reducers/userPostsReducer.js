import { FETCH_USER_POSTS_PENDING, FETCH_USER_POSTS_SUCCESS, FETCH_USER_POSTS_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    userPosts: {},
    error: null
}

export function userPostsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_POSTS_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_USER_POSTS_SUCCESS:
            return {
                ...state,
                pending: false,
                userPosts: action.userPosts
            }
        case FETCH_USER_POSTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getUserPosts = state => state.fetchUserPosts.userPosts.result;
export const getUserPostsPending = state => state.fetchUserPosts.pending;
export const getUserPostsError = state => state.fetchUserPosts.error;