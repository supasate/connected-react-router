import { LOCATION_CHANGE } from './actions'
import produce from 'immer'

/**
 * Adds query to location.
 * Utilises the search prop of location to construct query.
 */
const injectQuery = (location) => {
  if (location && location.query) {
    // Don't inject query if it already exists in history
    return location
  }

  const searchQuery = location && location.search

  if (typeof searchQuery !== 'string' || searchQuery.length === 0) {
    return {
      ...location,
      query: {}
    }
  }

  // Ignore the `?` part of the search string e.g. ?username=codejockie
  const search = searchQuery.substring(1)
  // Split the query string on `&` e.g. ?username=codejockie&name=Kennedy
  const queries = search.split('&')
  // Contruct query
  const query = queries.reduce((acc, currentQuery) => {
    // Split on `=`, to get key and value
    const [queryKey, queryValue] = currentQuery.split('=')
    return {
      ...acc,
      [queryKey]: queryValue
    }
  }, {})

  return {
    ...location,
    query
  }
}

const createConnectRouter = () => {

  const createRouterReducer = (history) => {
    const initialRouterState = {
      location: injectQuery(history.location),
      action: history.action,
    }

    /*
    * This reducer will update the state with the most recent location history
    * has transitioned to.
    */
    // return (state = initialRouterState, { type, payload } = {}) => {
    //   if (type === LOCATION_CHANGE) {
    //     const { location, action, isFirstRendering } = payload
    //     // Don't update the state ref for the first rendering
    //     // to prevent the double-rendering issue on initilization
    //     return isFirstRendering
    //       ? state
    //       : merge(state, { location: fromJS(injectQuery(location)), action })
    //   }

    //   return state
    // }


    return  produce((draft, { type, payload } = {}) => {
        if (type === LOCATION_CHANGE) {
            const { location, action, isFirstRendering } = payload

            // Don't update the state ref for the first rendering
            // to prevent the double-rendering issue on initilization
            if(!isFirstRendering){
                draft.action=action
                draft.location=injectQuery(location)
            }
          }
        return draft
      }, initialRouterState)
    

  }

  return createRouterReducer
}

export default createConnectRouter
