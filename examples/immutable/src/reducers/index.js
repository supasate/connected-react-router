import { combineReducers } from 'redux-immutable'
import counterReducer from './counter'

const rootReducer = combineReducers({
  count: counterReducer,
})

export default rootReducer
