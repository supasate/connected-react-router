import 'raf/polyfill'
import React from 'react'
import configureStore from 'redux-mock-store'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import { ActionCreators, instrument } from 'redux-devtools'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { act } from 'react-dom/test-utils'
import { createMemoryHistory } from 'history'
import { Route } from 'react-router'
import { Provider } from 'react-redux'
import createConnectedRouter from '../src/ConnectedRouter'
import { onLocationChanged } from '../src/actions'
import plainStructure from '../src/structure/plain'
import immutableStructure from '../src/structure/immutable'
import seamlessImmutableStructure from '../src/structure/seamless-immutable'
import { connectRouter, ConnectedRouter, routerMiddleware } from '../src'

Enzyme.configure({ adapter: new Adapter() })

const { mount } = Enzyme

// To fix the following warning
// Warning: An update to Router inside a test was not wrapped in act(...)
// We need to call this function with a mounted wrapper
// See https://github.com/enzymejs/enzyme/issues/2073.
const waitForComponentToPaint = async (wrapper) => {
   await act(async () => {
     await new Promise(resolve => setTimeout(resolve, 0))
     wrapper.update()
   })
}

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
      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      ))

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(3)
    })

    it('unlistens the history object when unmounted.', () => {
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      )

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      props.history.push('/new-location')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)

      wrapper.unmount()

      history.push('/new-location-after-unmounted')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)
    })

    it('supports custom context', () => {
      const context = React.createContext(null)
      waitForComponentToPaint(mount(
        <Provider store={store} context={context}>
          <ConnectedRouter {...props} context={context}>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      ))

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(3)
    })

    it('supports location state and key', () => {
      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      ))
      props.history.push('/new-location', { foo: 'bar' })
      expect(onLocationChangedSpy.mock.calls[1][0].state).toEqual({ foo: 'bar'})
    })

    it('only renders one time when mounted', () => {
      let renderCount = 0

      const RenderCounter = () => {
        renderCount++
        return null
      }

      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<RenderCounter />} />
          </ConnectedRouter>
        </Provider>
      ))

      expect(renderCount).toBe(1)
    })

    it('does not render again when non-related action is fired', () => {
      // Initialize the render counter variable
      let renderCount = 0

      // Create redux store with router state
      store = createStore(
        combineReducers({
          incrementReducer: (state = 0, action = {}) => {
            if (action.type === 'testAction') {
              return ++state
            }

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

      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<RenderCounter />} />
          </ConnectedRouter>
        </Provider>
      ))
      // Non-related action does not cause re-rendering
      store.dispatch({ type: 'testAction' })
      // By using children under Route, it doesn't re-render the same component.
      history.push('/new-location')
      // The only rendering is when being mounted.
      expect(renderCount).toBe(1)
    })

    it('does not call `props.onLocationChanged()` on intial location when `noInitialPop` prop is passed ', () => {
      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props} noInitialPop>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      ))

      expect(onLocationChangedSpy.mock.calls).toHaveLength(0)
    })
  })

  describe('with immutable structure', () => {
    let ConnectedRouter

    beforeEach(() => {
      ConnectedRouter = createConnectedRouter(immutableStructure)
    })

    it('calls `props.onLocationChanged()` when location changes.', () => {
      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      ))

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(3)
    })

    it('unlistens the history object when unmounted.', () => {
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      )
      waitForComponentToPaint(wrapper)

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)

      wrapper.unmount()

      history.push('/new-location-after-unmounted')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)
    })

    it('supports custom context', () => {
      const context = React.createContext(null)
      waitForComponentToPaint(mount(
        <Provider store={store} context={context}>
          <ConnectedRouter {...props} context={context}>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      ))

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

      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<RenderCounter />} />
          </ConnectedRouter>
        </Provider>
      ))

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

      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<RenderCounter />} />
          </ConnectedRouter>
        </Provider>
      ))

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
      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      ))

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(3)
    })

    it('unlistens the history object when unmounted.', () => {
      const wrapper = mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<div>Home</div>} />
          </ConnectedRouter>
        </Provider>
      )
      waitForComponentToPaint(wrapper)

      expect(onLocationChangedSpy.mock.calls).toHaveLength(1)

      history.push('/new-location')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)

      wrapper.unmount()

      history.push('/new-location-after-unmounted')

      expect(onLocationChangedSpy.mock.calls).toHaveLength(2)
    })

    it('only renders one time when mounted', () => {
      let renderCount = 0

      const RenderCounter = () => {
        renderCount++
        return null
      }

      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<RenderCounter />} />
          </ConnectedRouter>
        </Provider>
      ))

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

      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" element={<RenderCounter />} />
          </ConnectedRouter>
        </Provider>
      ))

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

    it('resets to the initial url', () => {
      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <div>Test</div>
          </ConnectedRouter>
        </Provider>
      ))

      let currentPath
      const historyUnsubscribe = history.listen(({location}) => {
        currentPath = location.pathname
      })

      history.push('/bar')
      devToolsStore.dispatch(ActionCreators.reset())

      expect(currentPath).toEqual('/foo')

      historyUnsubscribe()
    })

    it('handles toggle after history change', () => {
      waitForComponentToPaint(mount(
        <Provider store={store}>
          <ConnectedRouter {...props}>
            <div>Test</div>
          </ConnectedRouter>
        </Provider>
      ))

      let currentPath
      const historyUnsubscribe = history.listen(({location}) => {
        currentPath = location.pathname
      })

      history.push('/foo2') // DevTools action #1
      history.push('/foo3') // DevTools action #2

      // When we toggle an action, the devtools will revert the action
      // and we therefore expect the history to update to the previous path
      devToolsStore.dispatch(ActionCreators.toggleAction(3))
      expect(currentPath).toEqual('/foo2')

      historyUnsubscribe()
    })
  })
})
