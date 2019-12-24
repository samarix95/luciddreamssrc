import { SET_THEME_MODE } from '../actions/types';

const initialState = {
    palette: {
        type: "dark",
        primary: { main: "#3f51b5" },
        secondary: { main: "#f50057" },
    },
}

export function themeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_THEME_MODE:
            return { ...state, palette: action.themeModeState }

        default:
            return state
    }
}