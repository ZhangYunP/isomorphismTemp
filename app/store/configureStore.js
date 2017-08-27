import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from '../reducer'

const createStorer = applyMiddleware(thunkMiddleware)(createStore)

function configureStore(initState) {
  return createStorer(rootReducer, initState)
}

export default configureStore
