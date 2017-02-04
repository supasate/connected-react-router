import React, { Children, Component, PropTypes } from 'react'
import configureStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import { Route } from 'react-router'
import { mount } from 'enzyme'
import createConnectedRouter from '../src/ConnectedRouter'
import { onLocationChanged } from '../src/actions'
import plainStructure from '../src/structure/plain'
import immutableStructure from '../src/structure/immutable'

describe('ConnectedRouter', () => {
  let props
  let store
  let onLocationChangedSpy

  beforeEach(() => {
    // Rewire `onLocationChanged` of `createConnectedRouter` to contain a spy function
    onLocationChangedSpy = jest.fn(
      (location, action) => onLocationChanged(location, action)
    )
    createConnectedRouter.__Rewire__('onLocationChanged', onLocationChangedSpy)

    // Mock props
    props = {
      action: 'POP',
      location: {
        pathname: '/path/to/somewhere',
      },
      history: createMemoryHistory(),
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

      props.history.push('/new-location')
      props.history.push('/new-location-2')

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

      props.history.push('/new-location-after-unmounted')

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

      props.history.push('/new-location')
      props.history.push('/new-location-2')

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

      props.history.push('/new-location-after-unmounted')

      expect(onLocationChangedSpy.mock.calls)
        .toHaveLength(1)
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
