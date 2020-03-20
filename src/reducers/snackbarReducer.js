import { SET_SNACKBAR_MODE } from '../actions/types';

const initialState = {
    snackbar: {
        open: false,
        variant: '',
        message: '',
    },
}

export function snackbarReducer(state = initialState, action) {
    switch (action.type) {
        case SET_SNACKBAR_MODE:
            return { ...state, snackbar: action.snackbar }

        default:
            return state
    }
}