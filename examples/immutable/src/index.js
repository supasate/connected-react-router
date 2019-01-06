import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import Immutable from 'immutable'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import configureStore, { history } from './configureStore'

const initialState = Immutable.Map()
const store = configureStore(initialState)
const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <App history={history} />
      </Provider>
    </AppContainer>,
    document.getElementById('react-root')
  )
}

render()

// Hot reloading
if (module.hot) {
  // Reload components
  module.hot.accept('./App', () => {
    render()
  })
}
