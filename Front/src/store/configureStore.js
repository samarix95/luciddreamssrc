// import { createStore, applyMiddleware } from 'redux'
// import { rootReducer } from '../reducers'
// import logger from 'redux-logger'

//export const store = createStore(rootReducer, applyMiddleware(logger))

import { createStore } from 'redux'
import { rootReducer } from '../reducers'

export const store = createStore(rootReducer)