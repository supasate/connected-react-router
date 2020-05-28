import Immutable from 'immutable'
import getIn from './getIn'

const structure = {
  fromJS: jsValue => Immutable.fromJS(jsValue, (key, value) =>
    Immutable.Iterable.isIndexed(value) ? value.toList() : value.toMap()),
  getIn,
  merge: (state, payload) => Immutable.merge(state, payload),
  toJS: value => Immutable.Iterable.isIterable(value) ? value.toJS() : value,
}

export default structure
