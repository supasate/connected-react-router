import { combineReducers } from 'redux'
import { LOCATION_CHANGE } from '../src/actions'
import connectRouter from '../src/reducer'

describe('connectRouter', () => {
  it('creates new root reducer with router reducer inside', () => {
    const mockHistory = {
      location: {
        pathname: '/',
        search: '',
        hash: '',
      },
      action: 'POP',
    }
    const mockReducer = (state = 'initial', action) => {
      switch (action.type) {
        default:
          return state
      }
    }
    const rootReducer = combineReducers({
      mock: mockReducer,
    })

    const rootReducerWithRouter = connectRouter(mockHistory)(rootReducer)
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
          pathname: '/path/to/somewhere',
          search: '?query=test',
          hash: '',
        },
        action: 'PUSH',
      }
    }
    const nextState = rootReducerWithRouter(currentState, action)
    const expectedState = {
      mock: 'initial',
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
})
