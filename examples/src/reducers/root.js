import { combineReducers } from 'redux'
import counterReducer from './counter'

const rootReducer = combineReducers({
  count: counterReducer
})

export default rootReducer
