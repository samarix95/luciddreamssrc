import { SET_THEME_MODE } from '../actions/types';

const initialState = {
    palette: {
        type: "dark",
        primary: { main: "#f9a825" },
        secondary: { main: "#f50057" },
        error: { main: "#cc0000" },
    },
}

export function themeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_THEME_MODE:
            return { ...state, palette: action.palette }

        default:
            return state
    }
}