export const SET_LOGIN = 'SET_LOGIN'
export const SET_CLOUD = 'SET_CLOUD'
export const SET_STAR = 'SET_STAR'
export const SET_LANG = 'SET_LANG'
export const SET_THEME_MODE = 'SET_THEME_MODE'

export function setLogin(state) {
	return {
		type: SET_LOGIN,
		loginState: state,
	}
}
export function setCloud(state) {
	return {
		type: SET_CLOUD,
		cloudState: state,
	}
}
export function setStar(state) {
	return {
		type: SET_STAR,
		starState: state,
	}
}
export function setCurrLang(state) {
	return {
		type: SET_LANG,
		currLangState: state,
	}
}
export function setThemeMode(state) {
	return {
		type: SET_THEME_MODE,
		themeModeState: state,
	}
}