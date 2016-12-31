import { AppContainer } from 'react-hot-loader'
import { applyMiddleware, compose, createStore } from 'redux'
import { createBrowserHistory } from 'history'
import { routerMiddleware, connectRouter } from 'connected-react-router'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import rootReducer from './reducers'

const history = createBrowserHistory()

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  connectRouter(history)(rootReducer),
  composeEnhancer(
    applyMiddleware(
      routerMiddleware(history),
    ),
  ),
)

const renderWithHotReload = (AppComponent) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <AppComponent history={history} />
      </Provider>
    </AppContainer>,
    document.getElementById('react-root')
  )
}

renderWithHotReload(App)

// Hot reloading
if (module.hot) {
  // Reload components
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    renderWithHotReload(NextApp)
  })

  // Reload reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default
    store.replaceReducer(connectRouter(history)(nextRootReducer))
  })
}
