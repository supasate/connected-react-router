import { LOCATION_CHANGE } from './actions'

const createConnectRouter = (structure) => {
  const {
    fromJS,
    merge,
  } = structure

  const createRouterReducer = (history) => {
    const initialRouterState = fromJS({
      location: history.location,
      action: history.action,
    })
    
    /**
   * This reducer will update the state with the most recent location history
   * has transitioned to.
   */
    return (state = initialRouterState, { type, payload } = {}) => {
      if (type === LOCATION_CHANGE) {
        return merge(state, payload)
      }
  
      return state
    }
  }

  return createRouterReducer
}

export default createConnectRouter
