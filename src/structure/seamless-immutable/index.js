import SeamlessImmutable from 'seamless-immutable'
import getIn from '../plain/getIn'

const { static: Immutable } = SeamlessImmutable

const structure = {
  fromJS: value => Immutable.from(value),
  getIn,
  merge: (state, payload) => Immutable.merge(state, payload),
  toJS: value => Immutable.asMutable(value)
}

export default structure
