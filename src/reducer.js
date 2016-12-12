import { LOCATION_CHANGE } from './actions'

/**
 * This reducer will update the state with the most recent location history
 * has transitioned to.
 */
const initialState = {
 location: null
}

const routerReducer = (state = initialState, { type, payload } = {}) => {
  if (type === LOCATION_CHANGE) {
    return {
      ...state,
      ...payload,
    }
  }

  return state
}

export default routerReducer
