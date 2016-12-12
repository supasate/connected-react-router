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
class ConnectedRouter extends Component {
  constructor(props) {
    super(props)

    this.unlisten = props.history.listen((location, action) => {
      props.onLocationChanged(location, action)
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  render() {
    const { history, basename, children } = this.props

    return (
      <StaticRouter
        action={history.action}
        location={history.location}
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

ConnectedRouter.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.oneOfType([ PropTypes.object, PropTypes.string ]),
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
