import { SET_LANG } from '../actions/types';
import EnDict from '../dictionary/en';

const initialState = {
    currLang: EnDict,
}

export function currLangReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LANG:
            switch (action.currLangState.current) {
                case "Ru":
                    window.document.documentElement.lang = "ru";
                    break;
                case "En":
                    window.document.documentElement.lang = "en";
                    break;
                default:
                    window.document.documentElement.lang = "en";
                    break;
            }
            return { ...state, currLang: action.currLangState }
        default:
            return state
    }
}