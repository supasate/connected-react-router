import Immutable from 'immutable';
import getIn from './getIn';
var structure = {
  fromJS: function fromJS(jsValue) {
    return Immutable.fromJS(jsValue, function (key, value) {
      return Immutable.Iterable.isIndexed(value) ? value.toList() : value.toMap();
    });
  },
  getIn: getIn,
  merge: function merge(state, payload) {
    return Immutable.merge(state, payload);
  },
  toJS: function toJS(value) {
    return Immutable.Iterable.isIterable(value) ? value.toJS() : value;
  }
};
export default structure;