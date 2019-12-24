import { SET_LANG } from '../actions/types';
import EnDict from '../dictionary/en';

const initialState = {
    currLang: EnDict,
}

export function currLangReducer(state = initialState, action) {
    switch (action.type) {
        case SET_LANG:
            return { ...state, currLang: action.currLangState }

        default:
            return state
    }
}