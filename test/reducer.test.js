import { combineReducers } from 'redux'
import { combineReducers as combineReducersImmutable } from 'redux-immutable'
import { combineReducers as combineReducersSeamlessImmutable } from 'redux-seamless-immutable'
import Immutable from 'immutable'
import { LOCATION_CHANGE, connectRouter } from '../src'
import { connectRouter as connectRouterImmutable } from '../src/immutable'
import { connectRouter as connectRouterSeamlessImmutable } from '../src/seamless-immutable'

describe('connectRouter', () => {
  let mockHistory

  beforeEach(() => {
    mockHistory = {
      location: {
        pathname: '/',
        search: '',
        hash: '',
      },
      action: 'POP',
    }
  })

  describe('with plain structure', () => {
    it('creates new root reducer with router reducer inside', () => {
      const mockReducer = (state = {}, action) => {
        switch (action.type) {
          default:
            return state
        }
      }
      const rootReducer = combineReducers({
        mock: mockReducer,
        router: connectRouter(mockHistory)
      })

      const currentState = {
        mock: {},
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
        },
      }
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/path/to/somewhere',
            search: '?query=test',
            hash: '',
          },
          action: 'PUSH',
        }
      }
      const nextState = rootReducer(currentState, action)
      const expectedState = {
        mock: {},
        router: {
          location: {
            pathname: '/path/to/somewhere',
            search: '?query=test',
            hash: '',
          },
          action: 'PUSH',
        },
      }
      expect(nextState).toEqual(expectedState)
    })

    it('does not change state ref when action does not trigger any reducers', () => {
      const rootReducer = combineReducers({
        router: connectRouter(mockHistory)
      })

      const currentState = {
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
        },
      }
      const action = {
        type: "DUMMY_ACTION",
        payload: "dummy payload"
      }
      const nextState = rootReducer(currentState, action)
      expect(nextState).toBe(currentState)
    })

    it('does not change state ref when receiving LOCATION_CHANGE for the first rendering', () => {
      const rootReducer = combineReducers({
        router: connectRouter(mockHistory)
      })
      const currentState = {
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
        },
      }
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
          isFirstRendering: true,
        }
      }
      const nextState = rootReducer(currentState, action)
      expect(nextState).toBe(currentState)
    })
  })

  describe('with immutable structure', () => {
    it('creates new root reducer with router reducer inside', () => {
      const mockReducer = (state = Immutable.Map(), action) => {
        switch (action.type) {
          default:
            return state
        }
      }
      const rootReducer = combineReducersImmutable({
        mock: mockReducer,
        router: connectRouterImmutable(mockHistory)
      })

      const currentState = Immutable.fromJS({
        mock: {},
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
        },
      })
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/path/to/somewhere',
            search: '?query=test',
            hash: '',
          },
          action: 'PUSH',
        }
      }
      const nextState = rootReducer(currentState, action)
      const expectedState = Immutable.fromJS({
        mock: {},
        router: {
          location: {
            pathname: '/path/to/somewhere',
            search: '?query=test',
            hash: '',
          },
          action: 'PUSH',
        },
      })
      expect(nextState).toEqual(expectedState)
    })

    it('does not change state ref when receiving LOCATION_CHANGE for the first rendering', () => {
      const rootReducer = combineReducers({
        router: connectRouter(mockHistory)
      })
      const currentState = {
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
        },
      }
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
          isFirstRendering: true,
        }
      }
      const nextState = rootReducer(currentState, action)
      expect(nextState).toBe(currentState)
    })
  })

  describe('with seamless immutable structure', () => {
    it('creates new root reducer with router reducer inside', () => {
      const mockReducer = (state = {}, action) => {
        switch (action.type) {
          default:
            return state
        }
      }
      const rootReducer = combineReducersSeamlessImmutable({
        mock: mockReducer,
        router: connectRouterSeamlessImmutable(mockHistory)
      })

      const currentState = {
        mock: {},
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
        },
      }
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/path/to/somewhere',
            search: '?query=test',
            hash: '',
          },
          action: 'PUSH',
        }
      }
      const nextState = rootReducer(currentState, action)
      const expectedState = {
        mock: {},
        router: {
          location: {
            pathname: '/path/to/somewhere',
            search: '?query=test',
            hash: '',
          },
          action: 'PUSH',
        },
      }
      expect(nextState).toEqual(expectedState)
    })

    it('does not change state ref when receiving LOCATION_CHANGE for the first rendering', () => {
      const rootReducer = combineReducers({
        router: connectRouter(mockHistory)
      })
      const currentState = {
        router: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
        },
      }
      const action = {
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
          },
          action: 'POP',
          isFirstRendering: true,
        }
      }
      const nextState = rootReducer(currentState, action)
      expect(nextState).toBe(currentState)
    })
  })
})
