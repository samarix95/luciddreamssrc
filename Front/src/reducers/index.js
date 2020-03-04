import { combineReducers } from 'redux';
import { currLangReducer } from './currLang';
import { themeReducer } from './themeMode';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import { snackbarReducer } from './snackbarReducer';
import { tagsReducer } from "./tagsReducer.js";
import { technicsReducer } from "./technicsReducer.js";
import { userDataReducer } from "./userDataReducer.js";
import { userPostsReducer } from "./userPostsReducer.js";
import { connectPostsReducer } from "./connectPostsReducer.js";
import { userMapReducer } from "./userMapReducer.js";
import { randomUsersReducer } from "./randomUsersReducer.js";

export const rootReducer = combineReducers({
    lang: currLangReducer,
    themeMode: themeReducer,
    auth: authReducer,
    errors: errorReducer,
    snackbar: snackbarReducer,
    fetchTags: tagsReducer,
    fetchTechnics: technicsReducer,
    fetchUserData: userDataReducer,
    fetchUserPosts: userPostsReducer,
    fetchConnectPosts: connectPostsReducer,
    fetchUserMap: userMapReducer,
    fetchRandomUsers: randomUsersReducer,
});