import { FETCH_SEND_PCOMMENT_PENDING, FETCH_SEND_PCOMMENT_SUCCESS, FETCH_SEND_PCOMMENT_ERROR, RESET_SEND_PCOMMENT_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    data: {},
    error: null
}

export function sendPcommentsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_SEND_PCOMMENT_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_SEND_PCOMMENT_SUCCESS:
            return {
                ...state,
                pending: false,
                data: action.data
            }
        case FETCH_SEND_PCOMMENT_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        case RESET_SEND_PCOMMENT_ERROR:
            return {
                ...state,
                pending: false,
                error: null
            }
        default:
            return state;
    }
}

export const getSendPcomments = state => state.fetchSendPcommentsReducer.data.result;
export const getSendPcommentsPending = state => state.fetchSendPcommentsReducer.pending;
export const getSendPcommentsError = state => state.fetchSendPcommentsReducer.error;