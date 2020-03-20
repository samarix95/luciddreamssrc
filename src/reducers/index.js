import { combineReducers } from 'redux';
import { currLangReducer } from './currLang';
import { themeReducer } from './themeMode';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import { snackbarReducer } from './snackbarReducer';
import { tagsReducer } from "./tagsReducer.js";
import { technicsReducer } from "./technicsReducer.js";
import { avatarsReducer } from "./avatarsReducer.js";
import { userDataReducer } from "./userDataReducer.js";
import { userPostsReducer } from "./userPostsReducer.js";
import { connectPostsReducer } from "./connectPostsReducer.js";
import { userMapReducer } from "./userMapReducer.js";
import { randomUsersReducer } from "./randomUsersReducer.js";
import { pcommentsReducer } from "./pcommentsReducer.js";
import { sendPcommentsReducer } from "./sendPcommentsReducer.js";

import { updateUserDataReducer } from "./updateUserDataReducer.js";
import { updatePcommentsReducer } from "./updatePcommentsReducer.js";

import { createUserReducer } from "./createUserReducer.js";
import { loginUserReducer } from "./loginUserReducer.js";

export const rootReducer = combineReducers({
    lang: currLangReducer,
    themeMode: themeReducer,
    auth: authReducer,
    errors: errorReducer,
    snackbar: snackbarReducer,
    fetchTags: tagsReducer,
    fetchTechnics: technicsReducer,
    fetchAvatars: avatarsReducer,
    fetchUserData: userDataReducer,
    fetchUserPosts: userPostsReducer,
    fetchConnectPosts: connectPostsReducer,
    fetchUserMap: userMapReducer,
    fetchRandomUsers: randomUsersReducer,
    fetchUpdateUserData: updateUserDataReducer,
    fetchCreateUser: createUserReducer,
    fetchLoginUser: loginUserReducer,
    fetchPcomments: pcommentsReducer,
    fetchSendPcommentsReducer: sendPcommentsReducer,
    fetchUpdatePcommentsReducer: updatePcommentsReducer
});