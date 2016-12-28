import React from 'react'
import { createMemoryHistory } from 'history'
import { ConnectedRouter } from '../src/ConnectedRouter'
import { shallow } from 'enzyme'

describe('ConnectedRouter', () => {
  const minProps = {
    action: 'PUSH',
    location: {},
  }

  it('calls `props.onLocationChanged()` when location changes.', () => {
    const mockHistory = createMemoryHistory()
    const handleLocationChanged = jest.fn()

    shallow(
      <ConnectedRouter
        {...minProps}
        history={mockHistory}
        onLocationChanged={handleLocationChanged}
      />
    )

    expect(handleLocationChanged.mock.calls)
      .toHaveLength(0)

    mockHistory.push('/new-location')
    mockHistory.push('/new-location-2')

    expect(handleLocationChanged.mock.calls)
      .toHaveLength(2)
  })

  it('cleans up location changes listener when unmounts.', () => {
    const mockHistory = createMemoryHistory()
    const handleLocationChanged = jest.fn()
    const rendered = shallow(
      <ConnectedRouter
        {...minProps}
        history={mockHistory}
        onLocationChanged={handleLocationChanged}
      />
    )

    expect(handleLocationChanged.mock.calls)
      .toHaveLength(0)

    mockHistory.push('/new-location')

    expect(handleLocationChanged.mock.calls)
      .toHaveLength(1)

    rendered.unmount()

    mockHistory.push('/new-location-after-unmount')

    expect(handleLocationChanged.mock.calls)
      .toHaveLength(1)
  })
})
