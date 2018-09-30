import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import counterReducer from './counter'

const rootReducer = (history) => combineReducers({
  count: counterReducer,
  router: connectRouter(history)
})

export default rootReducer
