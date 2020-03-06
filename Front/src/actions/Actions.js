import {
	SET_LANG,
	FETCH_TAGS_PENDING, FETCH_TAGS_SUCCESS, FETCH_TAGS_ERROR,
	FETCH_TECHNICS_PENDING, FETCH_TECHNICS_SUCCESS, FETCH_TECHNICS_ERROR,
	FETCH_AVATARS_PENDING, FETCH_AVATARS_SUCCESS, FETCH_AVATARS_ERROR,
	FETCH_USER_DATA_PENDING, FETCH_USER_DATA_SUCCESS, FETCH_USER_DATA_ERROR,
	FETCH_USER_POSTS_PENDING, FETCH_USER_POSTS_SUCCESS, FETCH_USER_POSTS_ERROR,
	FETCH_CONNECT_POSTS_PENDING, FETCH_CONNECT_POSTS_SUCCESS, FETCH_CONNECT_POSTS_ERROR,
	FETCH_USER_MAP_PENDING, FETCH_USER_MAP_SUCCESS, FETCH_USER_MAP_ERROR,
	FETCH_RANDOM_USERS_PENDING, FETCH_RANDOM_USERS_SUCCESS, FETCH_RANDOM_USERS_ERROR,
	FETCH_UPDATE_USER_DATA_PENDING, FETCH_UPDATE_USER_DATA_SUCCESS, FETCH_UPDATE_USER_DATA_ERROR, RESET_UPDATE_USER_DATA_ERROR, RESET_UPDATE_USER_DATA,
	FETCH_CREATE_USER_PENDING, FETCH_CREATE_USER_SUCCESS, FETCH_CREATE_USER_ERROR, RESET_CREATE_USER_ERROR
} from '../actions/types.js';

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

/*Get data from DB*/
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
export function fetchTechnicsSuccess(technics) {
	return {
		type: FETCH_TECHNICS_SUCCESS,
		technics: technics
	}
}
export function fetchTechnicsError(error) {
	return {
		type: FETCH_TECHNICS_ERROR,
		error: error
	}
}

export function fetchAvatarsPending() {
	return {
		type: FETCH_AVATARS_PENDING
	}
}
export function fetchAvatarsSuccess(avatars) {
	return {
		type: FETCH_AVATARS_SUCCESS,
		avatars: avatars
	}
}
export function fetchAvatarsError(error) {
	return {
		type: FETCH_AVATARS_ERROR,
		error: error
	}
}

export function fetchUserDataPending() {
	return {
		type: FETCH_USER_DATA_PENDING
	}
}
export function fetchUserDataSuccess(userData) {
	return {
		type: FETCH_USER_DATA_SUCCESS,
		userData: userData
	}
}
export function fetchUserDataError(error) {
	return {
		type: FETCH_USER_DATA_ERROR,
		error: error
	}
}

export function fetchUserPostsPending() {
	return {
		type: FETCH_USER_POSTS_PENDING
	}
}
export function fetchUserPostsSuccess(userPosts) {
	return {
		type: FETCH_USER_POSTS_SUCCESS,
		userPosts: userPosts
	}
}
export function fetchUserPostsError(error) {
	return {
		type: FETCH_USER_POSTS_ERROR,
		error: error
	}
}

export function fetchConnectPostsPending() {
	return {
		type: FETCH_CONNECT_POSTS_PENDING
	}
}
export function fetchConnectPostsSuccess(connectPosts) {
	return {
		type: FETCH_CONNECT_POSTS_SUCCESS,
		connectPosts: connectPosts
	}
}
export function fetchConnectPostsError(error) {
	return {
		type: FETCH_CONNECT_POSTS_ERROR,
		error: error
	}
}

export function fetchUserMapPending() {
	return {
		type: FETCH_USER_MAP_PENDING
	}
}
export function fetchUserMapSuccess(userMap) {
	return {
		type: FETCH_USER_MAP_SUCCESS,
		userMap: userMap
	}
}
export function fetchUserMapError(error) {
	return {
		type: FETCH_USER_MAP_ERROR,
		error: error
	}
}

export function fetchRandomUsersPending() {
	return {
		type: FETCH_RANDOM_USERS_PENDING
	}
}
export function fetchRandomUsersSuccess(randomUsers) {
	return {
		type: FETCH_RANDOM_USERS_SUCCESS,
		randomUsers: randomUsers
	}
}
export function fetchRandomUsersError(error) {
	return {
		type: FETCH_RANDOM_USERS_ERROR,
		error: error
	}
}

/*Update data in DB*/
export function fetchUpdateUserDataPending() {
	return {
		type: FETCH_UPDATE_USER_DATA_PENDING
	}
}
export function fetchUpdateUserDataSuccess(data) {
	return {
		type: FETCH_UPDATE_USER_DATA_SUCCESS,
		data: data
	}
}
export function fetchUpdateUserDataError(error) {
	return {
		type: FETCH_UPDATE_USER_DATA_ERROR,
		error: error
	}
}
export function fetchResetUpdateUserDataError() {
	return {
		type: RESET_UPDATE_USER_DATA_ERROR,
		error: null
	}
}
export function fetchResetUpdateUserData() {
	return {
		type: RESET_UPDATE_USER_DATA,
		data: null
	}
}

/*Create user*/
export function fetchCreateUserPending() {
	return {
		type: FETCH_CREATE_USER_PENDING
	}
}
export function fetchCreateUserSuccess(newUser) {
	return {
		type: FETCH_CREATE_USER_SUCCESS,
		newUser: newUser
	}
}
export function fetchCreateUserError(error) {
	return {
		type: FETCH_CREATE_USER_ERROR,
		error: error
	}
}
export function fetchResetCreateUserError() {
	return {
		type: RESET_CREATE_USER_ERROR,
		error: null
	}
}