import createRouterReducer from './createRouterReducer'

const createConnectRouter = (structure) => {
  const {
    filterNotRouter,
    fromJS,
    getIn,
    setIn,
  } = structure

  const connectRouter = (history) => {
    const initialRouterState = fromJS({
      location: history.location,
      action: history.action,
    })

    const routerReducer = createRouterReducer(structure)(history)

    // Wrap a root reducer and return a new root reducer with router state
    return (rootReducer) => (state, action) => {
      let routerState = initialRouterState

      // Extract router state
      if (state) {
        routerState = getIn(state, ['router']) || routerState
        state = filterNotRouter(state)
      }
      const reducerResults = rootReducer(state, action)

      return setIn(reducerResults, ['router'], routerReducer(routerState, action))
    }
  }

  return connectRouter
}

export default createConnectRouter
