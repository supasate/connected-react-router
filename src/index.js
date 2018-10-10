import createAll from './createAll'
import plainStructure from './structure/plain'

export const {
  LOCATION_CHANGE,
  CALL_HISTORY_METHOD,
  push,
  replace,
  go,
  goBack,
  goForward,
  routerActions,
  ConnectedRouter,
  connectRouter,
  routerReducer,
  routerMiddleware,
  getLocation,
  getAction,
  createMatchSelector,
} = createAll(plainStructure)
