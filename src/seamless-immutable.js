import createAll from './createAll'
import immutableStructure from './structure/seamless-immutable'

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
  routerMiddleware
} = createAll(immutableStructure)
