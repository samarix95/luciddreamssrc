import { SET_LANG, FETCH_TAGS_PENDING, FETCH_TAGS_SUCCESS, FETCH_TAGS_ERROR, FETCH_TECHNICS_PENDING, FETCH_TECHNICS_SUCCESS, FETCH_TECHNICS_ERROR } from '../actions/types.js';

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

export function fetchTagsPending() {
	return {
		type: FETCH_TAGS_PENDING
	}
}

export function fetchTagsSuccess(tags) {
	return {
		type: FETCH_TAGS_SUCCESS,
		tags: tags
	}
}

export function fetchTagsError(error) {
	return {
		type: FETCH_TAGS_ERROR,
		error: error
	}
}

export function fetchTechnicsPending() {
	return {
		type: FETCH_TECHNICS_PENDING
	}
}

export function fetchTechnicsSuccess(tags) {
	return {
		type: FETCH_TECHNICS_SUCCESS,
		technics: tags
	}
}

export function fetchTechnicsError(error) {
	return {
		type: FETCH_TECHNICS_ERROR,
		error: error
	}
}
