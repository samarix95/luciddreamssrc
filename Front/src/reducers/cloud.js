import { SET_CLOUD, CLEAR_CLOUD } from '../actions/types';

const initialState = {
	clouds: [],
}

export function cloudsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_CLOUD:
			return {
				...state, clouds: [...state.clouds, action.cloudState]
			}
		case CLEAR_CLOUD:
			return {
				...state, clouds: []
			}
		default:
			return state
	}
}