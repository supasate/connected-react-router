import * as actions from './actions'
import createConnectedRouter from './ConnectedRouter'
import createConnectRouter from './reducer'
import routerMiddleware from './middleware'

const createAll = structure => ({
  ...actions,
  ConnectedRouter: createConnectedRouter(structure),
  connectRouter: createConnectRouter(structure),
  routerMiddleware,
})

export default createAll
