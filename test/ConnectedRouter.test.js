import 'raf/polyfill'
import React from 'react'
import configureStore from 'redux-mock-store'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { ActionCreators, instrument } from '@redux-devtools/core'
import { create } from "react-test-renderer"
import { createMemoryHistory } from 'history'
import { Route, Routes } from 'react-router'
import { Provider } from 'react-redux'
import createConnectedRouter from '../src/ConnectedRouter'
import { onLocationChanged, LOCATION_CHANGE } from '../src/actions'
import plainStructure from '../src/structure/plain'
import immutableStructure from '../src/structure/immutable'
import seamlessImmutableStructure from '../src/structure/seamless-immutable'
import { connectRouter, ConnectedRouter, routerMiddleware } from '../src'

describe('ConnectedRouter', () => {
  let props
  let store
  let history
  let onLocationChangedSpy

  beforeEach(() => {
    // Rewire `onLocationChanged` of `createConnectedRouter` to contain a spy function
    onLocationChangedSpy = jest.fn((location, action) =>
      onLocationChanged(location, action)
    )
    createConnectedRouter.__Rewire__('onLocationChanged', onLocationChangedSpy)

    // Reset history
    history = createMemoryHistory()

    // Mock props
    props = {
      action: 'POP',
      location: {
        pathname: '/path/to/somewhere',
      },
      history,
    }

    // Mock store
    const mockStore = configureStore()
    store = mockStore({
      router: {
        action: 'POP',
        location: props.history.location,
      }
    })
  })

  afterEach(() => {
    // Restore to remove a spy function
    createConnectedRouter.__ResetDependency__('onLocationChanged')
  })

  describe('with plain structure', () => {
    let ConnectedRouter

    beforeEach(() => {
      ConnectedRouter = createConnectedRouter(plainStructure)
    })

    it('calls `props.onLocationChanged()` when location changes.', () => {
      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(3)
    })

    it('unlistens the history object when unmounted.', () => {
      const renderer = create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      props.history.push('/new-location')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)

      renderer.unmount()

      history.push('/new-location-after-unmounted')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)
    })

    it('supports custom context', () => {
      const context = React.createContext(null)
      create(
        <Provider store={store} context={context}>
          <ConnectedRouter {...props} context={context}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(3)
    })

    it('supports location state and key', () => {
      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )
      props.history.push({ pathname: '/new-location'}, { foo: 'bar' })

      expect(onLocationChangedSpy.mock.calls[1][0].state).toEqual({ foo: 'bar'})
    })

    it('updates history when store location state changes', () => {
      store = createStore(
        combineReducers({
          router: connectRouter(props.history)
        }),
        compose(applyMiddleware(routerMiddleware(props.history)))
      )

      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      // Need to add PUSH action to history because initial POP action prevents history updates
      props.history.push({ pathname: "/" })
      expect(props.history.index).toEqual(1)

      store.dispatch({
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
            state: { foo: 'bar' }
          },
          action: 'PUSH',
        }
      })
      expect(props.history.index).toEqual(2)

      store.dispatch({
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
            state: { foo: 'baz' }
          },
          action: 'PUSH',
        }
      })
      expect(props.history.index).toEqual(3)
    })

    it('does not update history when store location state is unchanged', () => {
      store = createStore(
        combineReducers({
          router: connectRouter(props.history)
        }),
        compose(applyMiddleware(routerMiddleware(props.history)))
      )

      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      // Need to add PUSH action to history because initial POP action prevents history updates
      props.history.push({ pathname: "/" })
      expect(props.history.index).toEqual(1)

      store.dispatch({
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
            state: { foo: 'bar' }
          },
          action: 'PUSH',
        }
      })

      expect(props.history.index).toEqual(2)

      store.dispatch({
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
            state: { foo: 'bar' }
          },
          action: 'PUSH',
        }
      })

      expect(props.history.index).toEqual(2)
    })

    it('supports custom location state compare function', () => {
      store = createStore(
        combineReducers({
          router: connectRouter(props.history)
        }),
        compose(applyMiddleware(routerMiddleware(props.history)))
      )

      create(
        <Provider store={store}>
          <ConnectedRouter
            stateCompareFunction={(storeState, historyState) => {
              // If the store and history states are not undefined,
              // prevent history from updating when 'baz' is added to the store after 'bar'
              if (storeState != null && historyState != null) {
                if (storeState.foo === "baz" && historyState.foo === 'bar') {
                  return true
                }
              }

              // Otherwise return a normal object comparison result
              return JSON.stringify(storeState) === JSON.stringify(historyState)
            }}
            {...props}
          >
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      // Need to add PUSH action to history because initial POP action prevents history updates
      props.history.push({ pathname: "/" })

      store.dispatch({
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
            state: { foo: 'bar' }
          },
          action: 'PUSH',
        }
      })
      expect(props.history.index).toEqual(2)

      store.dispatch({
        type: LOCATION_CHANGE,
        payload: {
          location: {
            pathname: '/',
            search: '',
            hash: '',
            state: { foo: 'baz' }
          },
          action: 'PUSH',
        }
      })
      expect(props.history.index).toEqual(2)
    })

    it('only renders one time when mounted', () => {
      let renderCount = 0

      const RenderCounter = () => {
        renderCount++
        return null
      }

      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<RenderCounter />} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(renderCount).toBe(1)
    })

    it('does not render again when non-related action is fired', () => {
      // Initialize the render counter variable
      let renderCount = 0

      // Create redux store with router state
      store = createStore(
        combineReducers({
          incrementReducer: (state = 0, action = {}) => {
            if (action.type === 'testAction')
              return ++state

            return state
          },
          router: connectRouter(history)
        }),
        compose(applyMiddleware(routerMiddleware(history)))
      )


      const RenderCounter = () => {
        renderCount++
        return null
      }

      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<RenderCounter />} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      // Non-related action does not cause re-rendering
      store.dispatch({ type: 'testAction' })
      // By using children under Route, it doesn't re-render the same component.
      history.push('/new-location')
      // The only rendering is when being mounted.
      expect(renderCount).toBe(1)
    })

    it('does not call `props.onLocationChanged()` on intial location when `noInitialPop` prop is passed ', () => {
      create(
        <Provider store={store}>
          <ConnectedRouter {...props} noInitialPop>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(0)
    })
  })

  describe('with immutable structure', () => {
    let ConnectedRouter

    beforeEach(() => {
      ConnectedRouter = createConnectedRouter(immutableStructure)
    })

    it('calls `props.onLocationChanged()` when location changes.', () => {
      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(3)
    })

    it('unlistens the history object when unmounted.', () => {
      const renderer = create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)

      renderer.unmount()

      history.push('/new-location-after-unmounted')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)
    })

    it('supports custom context', () => {
      const context = React.createContext(null)
      create(
        <Provider store={store} context={context}>
          <ConnectedRouter {...props} context={context}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(3)
    })

    it('only renders one time when mounted', () => {
      let renderCount = 0

      const RenderCounter = () => {
        renderCount++
        return null
      }

      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<RenderCounter />} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(renderCount).toBe(1)
    })

    it('does not render again when non-related action is fired', () => {
      // Initialize the render counter variable
      let renderCount = 0

      // Create redux store with router state
      store = createStore(
        combineReducers({
          incrementReducer: (state = 0, action = {}) => {
            if (action.type === 'testAction')
              return ++state

            return state
          },
          router: connectRouter(history)
        }),
        compose(applyMiddleware(routerMiddleware(history)))
      )


      const RenderCounter = () => {
        renderCount++
        return null
      }

      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<RenderCounter />} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      // Non-related action does not cause re-rendering
      store.dispatch({ type: 'testAction' })
      // By using children under Route, it doesn't re-render the same component.
      history.push('/new-location')
      // The only rendering is when being mounted.
      expect(renderCount).toBe(1)
    })
  })

  describe('with seamless immutable structure', () => {
    let ConnectedRouter

    beforeEach(() => {
      ConnectedRouter = createConnectedRouter(seamlessImmutableStructure)
    })

    it('calls `props.onLocationChanged()` when location changes.', () => {
      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(3)
    })

    it('unlistens the history object when unmounted.', () => {
      const renderer = create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<div>Home</div>} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)

      renderer.unmount()

      history.push('/new-location-after-unmounted')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)
    })

    it('only renders one time when mounted', () => {
      let renderCount = 0

      const RenderCounter = () => {
        renderCount++
        return null
      }

      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<RenderCounter />} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      expect(renderCount).toBe(1)
    })

    it('does not render again when non-related action is fired', () => {
      // Initialize the render counter variable
      let renderCount = 0

      // Create redux store with router state
      store = createStore(
        combineReducers({
          incrementReducer: (state = 0, action = {}) => {
            if (action.type === 'testAction')
              return ++state

            return state
          },
          router: connectRouter(history)
        }),
        compose(applyMiddleware(routerMiddleware(history)))
      )


      const RenderCounter = () => {
        renderCount++
        return null
      }

      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Routes>
              <Route path="/" element={<RenderCounter />} />
            </Routes>
          </ConnectedRouter>
        </Provider>
      )

      // Non-related action does not cause re-rendering
      store.dispatch({ type: 'testAction' })
      // By using children under Route, it doesn't re-render the same component.
      history.push('/new-location')
      // The only rendering is when being mounted.
      expect(renderCount).toBe(1)
    })
  })

  describe('Redux DevTools', () => {
    let devToolsStore

    beforeEach(() => {
      // Set initial URL before syncing
      history.push('/foo')

      // Create redux store with router state
      store = createStore(
        combineReducers({ test: (state = 'test') => state, router: connectRouter(history) }),
        instrument()
      )
      devToolsStore = store.liftedStore
    })

    it('resets to the initial url', done => {
      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <div>Test</div>
          </ConnectedRouter>
        </Provider>
      )

      history.push('/bar')
      const historyUnsubscribe = history.listen(({location}) => {
        expect(location.pathname).toEqual('/foo')
        done()
      })

      devToolsStore.dispatch(ActionCreators.reset())

      historyUnsubscribe()
    })

    it('handles toggle after history change', done => {
      create(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <div>Test</div>
          </ConnectedRouter>
        </Provider>
      )

      history.push('/foo2') // DevTools action #1
      history.push('/foo3') // DevTools action #2

      const historyUnsubscribe = history.listen(({location}) => {
        expect(location.pathname).toEqual('/foo2')
        done()
      })

      // When we toggle an action, the devtools will revert the action
      // and we therefore expect the history to update to the previous path
      devToolsStore.dispatch(ActionCreators.toggleAction(3))

      historyUnsubscribe()
    })
  })
})
