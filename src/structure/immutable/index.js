import { Iterable, fromJS, merge } from 'immutable'
import getIn from './getIn'

const structure = {
  fromJS: jsValue => fromJS(jsValue, (key, value) =>
    Iterable.isIndexed(value) ? value.toList() : value.toMap()),
  getIn,
  merge: (state, payload) => merge(state, payload),
  toJS: value => Iterable.isIterable(value) ? value.toJS() : value,
}

export default structure
