import getIn from './getIn'
import get from './get'

const structure = {
  fromJS: value => value,
  getIn,
  get,
  merge: (state, payload) => ({ ...state, ...payload }),
  toJS: value => value,
}

export default structure
