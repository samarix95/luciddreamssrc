import { FETCH_TECHNICS_PENDING, FETCH_TECHNICS_SUCCESS, FETCH_TECHNICS_ERROR } from '../actions/types.js';

const initialState = {
    pending: true,
    technics: {},
    error: null
}

export function technicsReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_TECHNICS_PENDING:
            return {
                ...state,
                pending: true
            }
        case FETCH_TECHNICS_SUCCESS:
            return {
                ...state,
                pending: false,
                technics: action.technics
            }
        case FETCH_TECHNICS_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error
            }
        default:
            return state;
    }
}

export const getTechnics = state => state.fetchTechnics.technics;
export const getTechnicsPending = state => state.fetchTechnics.pending;
export const getTechnicsError = state => state.fetchTechnics.error;