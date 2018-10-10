import * as actions from './actions'
import createConnectedRouter from './ConnectedRouter'
import createConnectRouter from './createConnectRouter'
import createRouterReducer from './createRouterReducer'
import routerMiddleware from './middleware'
import createSelectors from './selectors'

const createAll = structure => ({
  ...actions,
  ...createSelectors(structure),
  ConnectedRouter: createConnectedRouter(structure),
  connectRouter: createConnectRouter(structure),
  routerReducer: createRouterReducer(structure),
  routerMiddleware,
})

export default createAll
