import { onLocationChanged } from './actions'

/**
 * This function synchronizes your history state with the Redux store.
 * Location changes flow from history to the store. An unsubscribe function
 * is returned if you ever what the store to stop being in sync with the state
 */
const syncHistoryWithStore = (history, store) => {
  // Whenever location changes, dispatch an action to get it in the store
  return history.listen((location, action) => {
    // Tell the store to update by dispatching an action
    store.dispatch(onLocationChanged(location, action))
  })
}

export default syncHistoryWithStore
