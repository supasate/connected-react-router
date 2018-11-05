import SeamlessImmutable from 'seamless-immutable'
import getIn from '../plain/getIn'
import get from '../plain/get'

const { static: Immutable } = SeamlessImmutable

const structure = {
  fromJS: value => Immutable.from(value),
  getIn,
  get,
  merge: (state, payload) => Immutable.merge(state, payload),
  toJS: value => Immutable.asMutable(value)
}

export default structure
