import { combineReducers } from 'redux-immutable'
import { connectRouter } from 'connected-react-router/immutable'
import counterReducer from './counter'

const rootReducer = (history) => combineReducers({
  count: counterReducer,
  router: connectRouter(history)
})

export default rootReducer
