import { combineReducers } from 'redux'
import { routerReducer } from 'connected-react-router'
import counterReducer from './counter'

const rootReducer = combineReducers({
  count: counterReducer,
  router: routerReducer,
})

export default rootReducer
