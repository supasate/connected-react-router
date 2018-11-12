import { matchPath } from "react-router"

const createSelectors = (structure) => {
  const { getIn, toJS } = structure

  const _getLocation = state => getIn(state, ['location'])
  const _getAction = state => getIn(state, ['action'])
  const isRouter = (value) => value != null && typeof value === 'object' && _getLocation(value) && _getAction(value)

  const getRouter = state => {
    const router = toJS(getIn(state, ['router']))
    if (!isRouter(router)) { throw 'Could not find router reducer in state tree, it must be mounted under "router"' }
    return router
  }
  const getLocation = state => toJS(_getLocation(getRouter(state)))
  const getAction = state => toJS(_getAction(getRouter(state)))

  // It only makes sense to recalculate the `matchPath` whenever the pathname
  // of the location changes. That's why `createMatchSelector` memoizes
  // the latest result based on the location's pathname.
  const createMatchSelector = path => {
    let lastPathname = null
    let lastMatch = null

    return state => {
      const { pathname } = getLocation(state) || {}
      if (pathname === lastPathname) {
        return lastMatch
      }
      lastPathname = pathname
      const match = matchPath(pathname, path)
      if (!match || !lastMatch || match.url !== lastMatch.url) {
        lastMatch = match
      }

      return lastMatch
    }
  }

  return {getLocation, getAction, getRouter, createMatchSelector}
}

export default createSelectors
