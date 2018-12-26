import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect, ReactReduxContext } from 'react-redux'
import { Router } from 'react-router'
import { onLocationChanged } from './actions'
import createSelectors from './selectors'

const createConnectedRouter = (structure) => {
  const { getLocation } = createSelectors(structure)
  /*
   * ConnectedRouter listens to a history object passed from props.
   * When history is changed, it dispatches action to redux store.
   * Then, store will pass props to component to render.
   * This creates uni-directional flow from history->store->router->components.
   */

  class ConnectedRouter extends PureComponent {
    constructor(props) {
      super(props)

      this.inTimeTravelling = false

      // Subscribe to store changes
      this.unsubscribe = props.store.subscribe(() => {
        // Extract store's location
        const {
          pathname: pathnameInStore,
          search: searchInStore,
          hash: hashInStore,
        } = getLocation(props.store.getState())
        // Extract history's location
        const {
          pathname: pathnameInHistory,
          search: searchInHistory,
          hash: hashInHistory,
        } = props.history.location

        // If we do time travelling, the location in store is changed but location in history is not changed
        if (pathnameInHistory !== pathnameInStore || searchInHistory !== searchInStore || hashInHistory !== hashInStore) {
          this.inTimeTravelling = true
          // Update history's location to match store's location
          props.history.push({
            pathname: pathnameInStore,
            search: searchInStore,
            hash: hashInStore,
          })
        }
      })

      const handleLocationChange = (location, action) => {
        // Dispatch onLocationChanged except when we're in time travelling
        if (!this.inTimeTravelling) {
          props.onLocationChanged(location, action)
        } else {
          this.inTimeTravelling = false
        }
      }

      // Listen to history changes
      this.unlisten = props.history.listen(handleLocationChange)
      // Dispatch a location change action for the initial location
      handleLocationChange(props.history.location, props.history.action)
    }

    componentWillUnmount() {
      this.unlisten()
      this.unsubscribe()
    }

    render() {
      const { history, children } = this.props

      return (
        <Router history={history}>
          { children }
        </Router>
      )
    }
  }

  ConnectedRouter.propTypes = {
    store: PropTypes.shape({
      getState: PropTypes.func.isRequired,
      subscribe: PropTypes.func.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      action: PropTypes.string.isRequired,
      listen: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired,
      push: PropTypes.func.isRequired,
    }).isRequired,
    basename: PropTypes.string,
    children: PropTypes.oneOfType([ PropTypes.func, PropTypes.node ]),
    onLocationChanged: PropTypes.func.isRequired,
  }

  const mapDispatchToProps = dispatch => ({
    onLocationChanged: (location, action) => dispatch(onLocationChanged(location, action))
  })

  const ConnectedRouterWithContext = props => {
    const Context = props.context || ReactReduxContext

    if (Context == null) {
      throw 'Please upgrade to react-redux v6'
    }

    return (
      <Context.Consumer>
        {({ store }) => <ConnectedRouter store={store} {...props} />}
      </Context.Consumer>
    )
  }

  ConnectedRouterWithContext.propTypes = {
    context: PropTypes.object,
  }

  return connect(null, mapDispatchToProps)(ConnectedRouterWithContext)
}

export default createConnectedRouter
