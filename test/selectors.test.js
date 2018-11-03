import { createStore, combineReducers } from "redux"
import { createBrowserHistory } from 'history'
import { connectRouter, getLocation, createMatchSelector, getAction } from '../src'
import { onLocationChanged } from '../src/actions'

const push = pathname => onLocationChanged(
  {
    pathname,
    search: '',
    hash: '',
  },
  'PUSH'
)

describe("selectors", () => {
  let store

  beforeEach(() => {
    const history = createBrowserHistory()
    const reducer = combineReducers({
      router: connectRouter(history)
    })
    store = createStore(reducer)
  })

  describe("getLocation", () => {
    it("gets the location from the state", () => {
      const location = { pathname: "/", hash: '', search: '' }
      store.dispatch(push('/'))
      const state = store.getState()
      expect(getLocation(state)).toEqual(location)
    })
  })

  describe("getAction", () => {
    it("gets the action from the state", () => {
      const action = "PUSH"
      store.dispatch(push('/'))
      const state = store.getState()
      expect(getAction(state)).toBe(action)
    })
  })

  describe("createMatchSelector", () => {
    it("matches correctly if the router is initialized", () => {
      const matchSelector = createMatchSelector("/")
      store.dispatch(push('/test'))
      const state = store.getState()
      expect(matchSelector(state)).toEqual({
        isExact: false,
        params: {},
        path: "/",
        url: "/"
      })
    })

    it("does not throw error if router has not yet initialized", () => {
      const matchSelector = createMatchSelector("/")
      const state = store.getState()
      expect(() => matchSelector(state)).not.toThrow()
    })

    it("does not update if the match is the same", () => {
      const matchSelector = createMatchSelector("/")
      store.dispatch(push('test1'))
      const match = matchSelector(store.getState())
      store.dispatch(push('test2'))
      const expectedMatch = matchSelector(store.getState())
      expect(match).toBe(expectedMatch)
    })

    it("updates if the match is different", () => {
      const matchSelector = createMatchSelector("/sushi/:type")
      store.dispatch(push('/sushi/california'))
      const californiaMatch = matchSelector(store.getState())
      store.dispatch(push('/sushi/dynamite'))
      const dynamiteMatch = matchSelector(store.getState())
      expect(californiaMatch).not.toBe(dynamiteMatch)
      expect(californiaMatch).toEqual({
        isExact: true,
        params: {type: 'california'},
        path: '/sushi/:type',
        url: '/sushi/california',
      })
      expect(dynamiteMatch).toEqual({
        isExact: true,
        params: {type: 'dynamite'},
        path: '/sushi/:type',
        url: '/sushi/dynamite',
      })
    })

    it("updates if the exact match is different", () => {
      const matchSelector = createMatchSelector({
        path: "/sushi",
        exact: true
      })
      store.dispatch(push('/sushi'))
      const okMatch = matchSelector(store.getState())
      store.dispatch(push('/sushi/dynamite'))
      const koMatch = matchSelector(store.getState())
      expect(okMatch).toEqual({
        isExact: true,
        params: {},
        path: '/sushi',
        url: '/sushi',
      })
      expect(koMatch).toBe(null)
    })
  })
})
