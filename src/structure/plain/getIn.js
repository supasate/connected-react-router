/* Code from github.com/erikras/redux-form by Erik Rasmussen */
import toPath from 'lodash.topath'

const getIn = (state, field) => {
  if (!state) {
    return state
  }

  const path = toPath(field)
  const length = path.length
  if (!length) {
    return undefined
  }

  let result = state
  for (let i = 0; i < length && !!result; ++i) {
    result = result[path[i]]
  }

  return result
}

export default getIn
