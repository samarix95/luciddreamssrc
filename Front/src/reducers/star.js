import { SET_STAR } from '../actions/Actions'

const initialState = {
	stars: [],
}

export function starsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_STAR:
			return {
				...state, stars: [...state.stars, action.starState]
			}

		default:
			return state
	}
}