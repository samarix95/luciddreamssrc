import { SET_LOGIN } from '../actions/Actions'

const initialState = {
  isLogin: false,
}

export function loginReducer(state = initialState, action) {
  switch (action.type) {
    case SET_LOGIN:
      return { ...state, isLogin: action.loginState }

    default:
      return state
  }
}