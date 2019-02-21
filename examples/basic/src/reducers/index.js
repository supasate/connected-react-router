import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import counterReducer from './counter'
import statusReducer from './status'

const rootReducer = (history) => combineReducers({
  status: statusReducer,
  count: counterReducer,
  router: connectRouter(history)
})

export default rootReducer
