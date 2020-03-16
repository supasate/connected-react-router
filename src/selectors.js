import { matchRoutes } from "react-router"

const createSelectors = (structure) => {
  const { getIn, toJS } = structure

  const isRouter = (value) => value != null &&
    typeof value === 'object' &&
    getIn(value, ['location']) &&
    getIn(value, ['action'])

  const getRouter = state => {
    const router = toJS(getIn(state, ['router']))
    if (!isRouter(router)) { throw 'Could not find router reducer in state tree, it must be mounted under "router"' }
    return router
  }
  const getLocation = state => toJS(getIn(getRouter(state), ['location']))
  const getAction = state => toJS(getIn(getRouter(state), ['action']))
  const getSearch = state => toJS(getIn(getRouter(state), ['location', 'search']))
  const getHash = state => toJS(getIn(getRouter(state), ['location', 'hash']))

  // It only makes sense to recalculate the `matchRoutes` whenever the pathname
  // of the location changes. That's why `createMatchSelector` memoizes
  // the latest result based on the location's pathname.
  const createMatchSelector = routes => {
    let lastPathname = null
    let lastMatch = null

    return state => {
      const { pathname } = getLocation(state) || {}
      if (pathname === lastPathname) {
        return lastMatch
      }
      lastPathname = pathname

      const match = matchRoutes(routes, pathname)
      lastMatch = match

      return lastMatch
    }
  }

  return {
    getLocation,
    getAction,
    getRouter,
    getSearch,
    getHash,
    createMatchSelector,
  }
}

export default createSelectors
