import createConnectedRouter from "./ConnectedRouter"
import createConnectRouter from "./reducer"
import createSelectors from "./selectors"
import plainStructure from "./structure/plain"

export { LOCATION_CHANGE, CALL_HISTORY_METHOD, onLocationChanged, push, replace, go, goBack, goForward, routerActions } from "./actions"
export { default as routerMiddleware } from "./middleware"

export const ConnectedRouter = /*#__PURE__*/ createConnectedRouter(plainStructure)
export const connectRouter = /*#__PURE__*/ createConnectRouter(plainStructure)
export const { getLocation, getAction, getHash, getSearch, createMatchSelector } = /*#__PURE__*/ createSelectors(plainStructure)
