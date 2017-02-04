import getIn from './getIn'
import setIn from './setIn'

const structure = {
  filterNotRouter: (state) => {
    const { router, ...rest } = state // eslint-disable-line no-unused-vars
    return rest
  },
  fromJS: value => value,
  getIn,
  merge: (state, payload) => ({ ...state, ...payload }),
  setIn,
  toJS: value => value,
}

export default structure
