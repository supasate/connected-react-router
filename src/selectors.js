import { matchPath } from "react-router"

const createSelectors = (structure) => {
  const { getIn, toJS } = structure
  const getLocation = state => toJS(getIn(state, ['router', 'location']))
  const getAction = state => toJS(getIn(state, ['router', 'action']))

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
