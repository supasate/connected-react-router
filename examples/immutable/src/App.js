import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router/immutable'
import routes from './routes'

const App = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      { routes }
    </ConnectedRouter>
  )
}

App.propTypes = {
  history: PropTypes.object,
}

export default App
