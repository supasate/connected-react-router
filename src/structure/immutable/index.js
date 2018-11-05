import { Iterable, fromJS } from 'immutable'
import getIn from './getIn'
import get from './get'

const structure = {
  fromJS: jsValue => fromJS(jsValue, (key, value) =>
    Iterable.isIndexed(value) ? value.toList() : value.toMap()),
  getIn,
  get,
  merge: (state, payload) => state.merge(payload),
  toJS: value => Iterable.isIterable(value) ? value.toJS() : value,
}

export default structure
