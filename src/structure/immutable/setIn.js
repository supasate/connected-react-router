/* Code from github.com/erikras/redux-form by Erik Rasmussen */
import { List, Map } from 'immutable'

const undefinedArrayMerge = (previous, next) =>
  next !== undefined
    ? next
    : previous

const mergeLists = (original, value) =>
  original && List.isList(original)
    ? original.mergeDeepWith(undefinedArrayMerge, value)
    : value

/*
 * ImmutableJS' setIn function doesn't support array (List) creation
 * so we must pre-insert all arrays in the path ahead of time.
 *
 * Additionally we must also pre-set a dummy Map at the location
 * of an array index if there's parts that come afterwards because
 * the setIn function uses `{}` to mark an unset value instead of
 * undefined (which is the case for list / arrays).
 */
export default function setIn(state, path, value) {
  return state.withMutations(mutable => {
    for (let pathIndex = 0; pathIndex < path.length - 1; ++pathIndex) {
      const nextPart = path[pathIndex + 1]
      if (isNaN(nextPart)) {
        continue
      }

      const arr = []
      arr[nextPart] = new Map()
      mutable = mutable.updateIn(
        path.slice(0, pathIndex + 1),
        value => mergeLists(value, new List(arr)))
    }

    return mutable.setIn(path, value)
  })
}
