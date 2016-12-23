export { LOCATION_CHANGE } from './actions'
export connectRouter from './reducer'

export {
  CALL_HISTORY_METHOD,
  push, replace, go, goBack, goForward,
  routerActions
} from './actions'

export routerMiddleware from './middleware'
export ConnectedRouter from './ConnectedRouter'
