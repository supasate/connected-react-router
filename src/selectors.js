import { matchPath } from "react-router"
import isObject from 'lodash/isObject'

const createSelectors = (structure) => {
  const { get, toJS } = structure
  const getRouter = state => {
    const router = toJS(get(state, 'router'))
    if (!isObject(router)) { throw 'Could not find router reducer in state tree. Are you sure it is mounted under "router"?' }
    return router
  }
  const getLocation = state => toJS(get(getRouter(state), 'location'))
  const getAction = state => toJS(get(getRouter(state), 'action'))

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

  return {getLocation, getAction, createMatchSelector}
}

export default createSelectors
