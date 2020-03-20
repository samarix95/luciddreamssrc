import { FETCH_UPDATE_PCOMMENT_PENDING, FETCH_UPDATE_PCOMMENT_SUCCESS, FETCH_UPDATE_PCOMMENT_ERROR, RESET_UPDATE_PCOMMENT_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    data: {},
    error: null
}

export function updatePcommentsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_UPDATE_PCOMMENT_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_UPDATE_PCOMMENT_SUCCESS:
            return {
                ...state,
                pending: false,
                data: action.data
            }
        case FETCH_UPDATE_PCOMMENT_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case RESET_UPDATE_PCOMMENT_ERROR:
            return {
                ...state,
                pending: false,
                error: null
            }
        default:
            return state;
    }
}