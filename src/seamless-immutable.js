import createConnectedRouter from "./ConnectedRouter"
import createConnectRouter from "./reducer"
import createSelectors from "./selectors"
import immutableStructure from './structure/seamless-immutable'

export { LOCATION_CHANGE, CALL_HISTORY_METHOD, onLocationChanged, push, replace, go, goBack, goForward, routerActions } from "./actions"
export { default as routerMiddleware } from "./middleware"

export const ConnectedRouter = /*#__PURE__*/ createConnectedRouter(immutableStructure)
export const connectRouter = /*#__PURE__*/ createConnectRouter(immutableStructure)
export const { getLocation, getAction, getHash, getSearch, createMatchSelector } = /*#__PURE__*/ createSelectors(immutableStructure)
