import { SET_LANG, SET_THEME_MODE } from '../actions/types';

export function setCloud(state) {
	return {
		type: state.type,
		cloudState: state.cloudState,
	}
}
export function setStar(state) {
	return {
		type: state.type,
		starState: state.starState,
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
export function setUserState(state) {
	return {
		type: state.type,
		payload: state.payload
	}
}