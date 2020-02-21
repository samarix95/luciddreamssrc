import { SET_LANG } from '../actions/types';

export function setCurrLang(state) {
	return {
		type: SET_LANG,
		currLangState: state,
	}
}
export function setTheme(state) {
	return {
		type: state.type,
		palette: state.palette,
	}
}
export function setUserState(state) {
	return {
		type: state.type,
		payload: state.payload,
	}
}
export function setSnackbar(state) {
	return {
		type: state.type,
		snackbar: state.snackbar,
	}
}