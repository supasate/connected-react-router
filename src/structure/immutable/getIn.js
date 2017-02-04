/* Code from github.com/erikras/redux-form by Erik Rasmussen */
import { Iterable } from 'immutable'
import toPath from 'lodash.topath'
import plainGetIn from '../plain/getIn'

const getIn = (state, field) =>
  Iterable.isIterable(state)
    ? state.getIn(toPath(field))
    : plainGetIn(state, field)

export default getIn
