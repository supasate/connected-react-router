import React from 'react'
import { createMemoryHistory } from 'history'
import { ConnectedRouter } from '../src/ConnectedRouter'
import { shallow } from 'enzyme'

describe('ConnectedRouter', () => {
  let props

  beforeEach(() => {
    props = {
      action: 'POP',
      location: {},
      history: createMemoryHistory(),
      onLocationChanged: jest.fn(),
    }
  })

  it('calls `props.onLocationChanged()` when location changes.', () => {
    shallow(<ConnectedRouter {...props} />)

    expect(props.onLocationChanged.mock.calls)
      .toHaveLength(0)

    props.history.push('/new-location')
    props.history.push('/new-location-2')

    expect(props.onLocationChanged.mock.calls)
      .toHaveLength(2)
  })

  it('cleans up location changes listener when unmounts.', () => {
    const wrapper = shallow(<ConnectedRouter {...props} />)

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
