import createConnectedRouter from "./ConnectedRouter"
import createConnectRouter from "./reducer-immer"
import createSelectors from "./selectors"
import immerStructure from "./structure/plain"

export { LOCATION_CHANGE, CALL_HISTORY_METHOD, onLocationChanged, push, replace, go, goBack, goForward, routerActions } from "./actions"
export { default as routerMiddleware } from "./middleware"

export const ConnectedRouter = /*#__PURE__*/ createConnectedRouter(immerStructure)
export const connectRouter = /*#__PURE__*/ createConnectRouter()
export const { getLocation, getAction, getHash, getRouter, getSearch, createMatchSelector } = /*#__PURE__*/ createSelectors(immerStructure)
