import 'raf/polyfill'
import React, { Children, Component } from 'react'
import PropTypes from 'prop-types'
import configureStore from 'redux-mock-store'
import { createStore, combineReducers } from 'redux'
import { ActionCreators, instrument } from 'redux-devtools'
import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { createMemoryHistory } from 'history'
import { Route } from 'react-router'
import createConnectedRouter from '../src/ConnectedRouter'
import { onLocationChanged } from '../src/actions'
import plainStructure from '../src/structure/plain'
import immutableStructure from '../src/structure/immutable'
import { connectRouter, ConnectedRouter } from '../src'

Enzyme.configure({ adapter: new Adapter() })

const { mount } = Enzyme

describe('ConnectedRouter', () => {
  let props
  let store
  let history
  let onLocationChangedSpy

  beforeEach(() => {
    // Rewire `onLocationChanged` of `createConnectedRouter` to contain a spy function
    onLocationChangedSpy = jest.fn(
      (location, action) => onLocationChanged(location, action)
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
      },
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
      mount(
        <ContextWrapper store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" render={() => <div>Home</div>} />
          </ConnectedRouter>
        </ContextWrapper>
      )

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(0)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(2)
    })

    it('unlistens the history object when unmounted.', () => {
      const wrapper = mount(
        <ContextWrapper store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" render={() => <div>Home</div>} />
          </ConnectedRouter>
        </ContextWrapper>
      )

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(0)

      props.history.push('/new-location')

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(1)

      wrapper.unmount()

      history.push('/new-location-after-unmounted')

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(1)
    })
  })

  describe('with immutable structure', () => {
    let ConnectedRouter

    beforeEach(() => {
      ConnectedRouter = createConnectedRouter(immutableStructure)
    })

    it('calls `props.onLocationChanged()` when location changes.', () => {
      mount(
        <ContextWrapper store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" render={() => <div>Home</div>} />
          </ConnectedRouter>
        </ContextWrapper>
      )

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(0)

      history.push('/new-location')
      history.push('/new-location-2')

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(2)
    })

    it('unlistens the history object when unmounted.', () => {
      const wrapper = mount(
        <ContextWrapper store={store}>
          <ConnectedRouter {...props}>
            <Route path="/" render={() => <div>Home</div>} />
          </ConnectedRouter>
        </ContextWrapper>
      )

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(0)

      history.push('/new-location')

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(1)

      wrapper.unmount()

      history.push('/new-location-after-unmounted')

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(1)
    })
  })

  describe('Redux DevTools', () => {
    let devToolsStore

    beforeEach(() => {
      // Set initial URL before syncing
      history.push('/foo')

      // Create redux store with router state
      store = createStore(
        connectRouter(history)(combineReducers({ test: (state = 'test') => (state) })),
        instrument()
      )
      devToolsStore = store.liftedStore
    })

    it('resets to the initial url', () => {
      mount(
        <ContextWrapper store={store}>
          <ConnectedRouter {...props}>
            <div>Test</div>
          </ConnectedRouter>
        </ContextWrapper>
      )

      let currentPath
      const historyUnsubscribe = history.listen(location => {
        currentPath = location.pathname
      })

      history.push('/bar')
      devToolsStore.dispatch(ActionCreators.reset())

      expect(currentPath).toEqual('/foo')

      historyUnsubscribe()
    })

    it('handles toggle after history change', () => {
      mount(
        <ContextWrapper store={store}>
          <ConnectedRouter {...props}>
            <div>Test</div>
          </ConnectedRouter>
        </ContextWrapper>
      )

      let currentPath
      const historyUnsubscribe = history.listen(location => {
        currentPath = location.pathname
      })

      history.push('/foo2') // DevTools action #1
      history.push('/foo3') // DevTools action #2

      // When we toggle an action, the devtools will revert the action
      // and we therefore expect the history to update to the previous path
      devToolsStore.dispatch(ActionCreators.toggleAction(2))
      expect(currentPath).toEqual('/foo2')

      historyUnsubscribe()
    })
  })
})

class ContextWrapper extends Component {
  getChildContext() {
    return {
      store: this.store
    }
  }

  constructor(props, context) {
    super(props, context)

    this.store = props.store
  }

  render() {
    return Children.only(this.props.children)
  }
}

const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
})

ContextWrapper.propTypes = {
  store: storeShape.isRequired,
  children: PropTypes.element.isRequired,
}

ContextWrapper.childContextTypes = {
  store: storeShape.isRequired,
}
