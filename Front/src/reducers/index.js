import { combineReducers } from 'redux'
import { currLangReducer } from './currLang'
import { userReducer } from './user'
import { loginReducer } from './login'
import { cloudsReducer } from './cloud'
import { starsReducer } from './star'
import { themeReducer } from './themeMode'

export const rootReducer = combineReducers({
    lang: currLangReducer,
    user: userReducer,
    login: loginReducer,
    clouds: cloudsReducer,
    stars: starsReducer,
    themeMode: themeReducer,
})