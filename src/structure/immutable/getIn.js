/* Code from github.com/erikras/redux-form by Erik Rasmussen */
import { Iterable } from 'immutable'
import plainGetIn from '../plain/getIn'

const getIn = (state, path) =>
  Iterable.isIterable(state)
    ? state.getIn(path)
    : plainGetIn(state, path)

export default getIn
