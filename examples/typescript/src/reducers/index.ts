import { combineReducers } from 'redux'
import counterReducer from './counter'

const rootReducer = combineReducers({
  count: counterReducer,
})

export interface State {
  count: number
  router: {
    location: {
      pathname: string
      search: string
      hash: string
    }
  }
}

export default rootReducer
