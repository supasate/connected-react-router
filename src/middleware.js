import { CALL_HISTORY_METHOD } from './actions'

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
const routerMiddleware = (history) => store => next => action => { // eslint-disable-line no-unused-vars
  if (action.type !== CALL_HISTORY_METHOD) {
    return next(action)
  }

  const { payload: { method, args } } = action
  history[method](...args)
}


export default routerMiddleware
