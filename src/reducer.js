import { LOCATION_CHANGE } from './actions'

/**
 * This reducer will update the state with the most recent location history
 * has transitioned to.
 */
const routerReducer = (state, { type, payload } = {}) => {
  if (type === LOCATION_CHANGE) {
    return {
      ...state,
      ...payload,
    }
  }

  return state
}

const connectRouter = (history) => {
  const initialRouterState = {
    location: history.location,
    action: history.action,
  }
  // Wrap a root reducer and return a new root reducer with router state
  return (rootReducer) => (state, action) => {
    let routerState = initialRouterState

    // Extract router state
    if (state) {
      const { router, ...rest} = state
      routerState = router || routerState
      state = rest
    }
    const reducerResults = rootReducer(state, action)

    return {
      ...reducerResults,
      router: routerReducer(routerState, action)
    }
  }
}

export default connectRouter