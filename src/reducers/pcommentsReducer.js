import { FETCH_PCOMMENTS_PENDING, FETCH_PCOMMENTS_SUCCESS, FETCH_PCOMMENTS_ERROR, RESET_PCOMMENTS_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    comments: {},
    error: null
}

export function pcommentsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_PCOMMENTS_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_PCOMMENTS_SUCCESS:
            return {
                ...state,
                pending: false,
                comments: action.comments
            }
        case FETCH_PCOMMENTS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case RESET_PCOMMENTS_ERROR:
            return {
                ...state,
                pending: false,
                error: null
            }
        default:
            return state;
    }
}

export const getPcomments = state => state.fetchPcomments.comments.result;
export const getPcommentsPending = state => state.fetchPcomments.pending;
export const getPcommentsError = state => state.fetchPcomments.error;