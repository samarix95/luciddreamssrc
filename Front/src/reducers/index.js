import { combineReducers } from 'redux';
import { currLangReducer } from './currLang';
import { themeReducer } from './themeMode';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import { snackbarReducer } from './snackbarReducer';
import { tagsReducer } from "./tagsReducer.js";
import { technicsReducer } from "./technicsReducer.js";

export const rootReducer = combineReducers({
    lang: currLangReducer,
    themeMode: themeReducer,
    auth: authReducer,
    errors: errorReducer,
    snackbar: snackbarReducer,
    fetchTags: tagsReducer,
    fetchTechnics: technicsReducer,
});