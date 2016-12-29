import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { StaticRouter } from 'react-router'
import { onLocationChanged } from './actions'

/*
 * ConnectedRouter listens to a history object passed from props.
 * When history is changed, it dispatches action to redux store.
 * Then, store will pass props to component to render.
 * This creates uni-directional flow from history->store->router->components.
 */

export class ConnectedRouter extends Component {
  constructor(props, context) {
    super(props)

    this.inTimeTravelling = false

    // Subscribe to store changes
    this.unsubscribe = context.store.subscribe(() => {
      const locationInStore = context.store.getState().router.location.pathname
      const locationInHistory = props.history.location.pathname

      // If we do time travelling, the location in store is changed but location in history is not changed
      if (locationInHistory !== locationInStore) {
        this.inTimeTravelling = true
        // Update history's location to match store's location
        props.history.push(locationInStore)
      }
    })

    // Listen to history changes
    this.unlisten = props.history.listen((location, action) => {
      // Dispatch onLocationChanged except when we're in time travelling
      if (!this.inTimeTravelling) {
        props.onLocationChanged(location, action)
      } else {
        this.inTimeTravelling = false
      }
    })
  }

  componentWillUnmount() {
    this.unlisten()
    this.unsubscribe()
  }

  render() {
    const { action, location, history, basename, children } = this.props

    return (
      <StaticRouter
        action={action}
        location={location}
        basename={basename}
        onPush={history.push}
        onReplace={history.replace}
        blockTransitions={history.block}
      >
        { children }
      </StaticRouter>
    )
  }
}

ConnectedRouter.contextTypes = {
  store: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
  }).isRequired,
}

ConnectedRouter.propTypes = {
  history: PropTypes.shape({
    listen: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  action: PropTypes.string.isRequired,
  basename: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.func, PropTypes.node ]),
  onLocationChanged: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  action: state.router.action,
  location: state.router.location,
})

const mapDispatchToProps = dispatch => ({
  onLocationChanged: (location, action) => dispatch(onLocationChanged(location, action))
})

export default connect(mapStateToProps, mapDispatchToProps)(ConnectedRouter)
