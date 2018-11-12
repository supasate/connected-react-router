import getIn from './getIn'

const structure = {
  fromJS: value => value,
  getIn,
  merge: (state, payload) => ({ ...state, ...payload }),
  toJS: value => value,
}

export default structure
