import { LOCATION_CHANGE } from './actions'

/**
 * This reducer will update the state with the most recent location history
 * has transitioned to.
 */
const createRouterReducer = (structure) => (history) =>  {
  const {
    fromJS,
    merge,
  } = structure

  const initialState = fromJS({
    location: history.location,
    action: history.action,
  })

  /**
   * This reducer will update the state with the most recent location history
   * has transitioned to.
   */
  const routerReducer = (state = initialState, { type, payload } = {}) => {
    if (type === LOCATION_CHANGE) {
      return merge(state, payload)
    }

    return state
  }

  return routerReducer
}

export default createRouterReducer
