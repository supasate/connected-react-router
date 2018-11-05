import { Iterable } from 'immutable'
import plainGet from '../plain/get'

const getIn = (state, key) =>
  Iterable.isIterable(state)
    ? state.get(key)
    : plainGet(state, key)

export default getIn
