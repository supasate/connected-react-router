import { Iterable, fromJS } from 'immutable'
import getIn from './getIn'
import setIn from './setIn'

const structure = {
  filterNotRouter: (state) => state.filterNot((v, k) => k === 'router'),
  fromJS: jsValue => fromJS(jsValue, (key, value) =>
    Iterable.isIndexed(value) ? value.toList() : value.toMap()),
  getIn,
  merge: (state, payload) => state.merge(payload),
  setIn,
  toJS: value => Iterable.isIterable(value) ? value.toJS() : value,
}

export default structure
