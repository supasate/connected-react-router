import React, { Children, Component, PropTypes } from 'react'
import configureStore from 'redux-mock-store'
import { createMemoryHistory } from 'history'
import { Route } from 'react-router'
import { ConnectedRouter } from '../src/ConnectedRouter'
import { mount } from 'enzyme'

describe('ConnectedRouter', () => {
  let props
  let store

  beforeEach(() => {
    props = {
      action: 'POP',
      location: {
        pathname: '/path/to/somewhere',
      },
      history: createMemoryHistory(),
      onLocationChanged: jest.fn(),
    }
    const mockStore = configureStore()
    store = mockStore({
      router: {
        action: 'POP',
        location: props.history.location,
      },
    })
  })

  it('calls `props.onLocationChanged()` when location changes.', () => {
    mount(
      <ContextWrapper store={store}>
        <ConnectedRouter {...props}>
          <Route path="/" render={() => <div>Home</div>} />
        </ConnectedRouter>
      </ContextWrapper>
    )

    expect(props.onLocationChanged.mock.calls)
      .toHaveLength(0)

    props.history.push('/new-location')
    props.history.push('/new-location-2')

    expect(props.onLocationChanged.mock.calls)
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

    expect(props.onLocationChanged.mock.calls)
      .toHaveLength(0)

    props.history.push('/new-location')

    expect(props.onLocationChanged.mock.calls)
      .toHaveLength(1)

    wrapper.unmount()

    props.history.push('/new-location-after-unmounted')

    expect(props.onLocationChanged.mock.calls)
      .toHaveLength(1)
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
