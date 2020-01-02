import { combineReducers } from 'redux';
import { currLangReducer } from './currLang';
import { cloudsReducer } from './cloud';
import { starsReducer } from './star';
import { themeReducer } from './themeMode';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import { snackbarReducer } from './snackbarReducer';

export const rootReducer = combineReducers({
    lang: currLangReducer,
    clouds: cloudsReducer,
    stars: starsReducer,
    themeMode: themeReducer,
    auth: authReducer,
    errors: errorReducer,
    snackbar: snackbarReducer,
});