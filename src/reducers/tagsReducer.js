import { FETCH_TAGS_PENDING, FETCH_TAGS_SUCCESS, FETCH_TAGS_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    tags: {},
    error: null
}

export function tagsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TAGS_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_TAGS_SUCCESS:
            return {
                ...state,
                pending: false,
                tags: action.tags
            }
        case FETCH_TAGS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getTags = state => state.fetchTags.tags;
export const getTagsPending = state => state.fetchTags.pending;
export const getTagsError = state => state.fetchTags.error;