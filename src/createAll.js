import * as actions from './actions'
import createConnectedRouter from './ConnectedRouter'
import createConnectRouter from './reducer'
import routerMiddleware from './middleware'
import createSelectors from './selectors'


const createAll = structure => {
  const {connectRouter, routerReducer} = createConnectRouter(structure)
  return {
  ...actions,
  ...createSelectors(structure),
  ConnectedRouter: createConnectedRouter(structure),
  connectRouter,
  routerMiddleware,
  routerReducer
}}

export default createAll
