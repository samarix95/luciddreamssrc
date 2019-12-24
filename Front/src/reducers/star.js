import { SET_STAR, CLEAR_STAR } from '../actions/types';

const initialState = {
	stars: [],
}

export function starsReducer(state = initialState, action) {
	switch (action.type) {
		case SET_STAR:
			return {
				...state, stars: [...state.stars, action.starState]
			}
		case CLEAR_STAR:
			return {
				...state, stars: []
			}
		default:
			return state
	}
}