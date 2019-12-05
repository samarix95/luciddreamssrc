import { SET_CLOUD } from '../actions/Actions'

const initialState = {
	clouds: [],
}

export function cloudsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_CLOUD:
			return {
				...state, clouds: [...state.clouds, action.cloudState]
			}
		default:
			return state
	}
}