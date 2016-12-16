import { AppContainer } from 'react-hot-loader'
import { applyMiddleware, compose, createStore } from 'redux'
import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import rootReducer from './reducers/root'

const history = createBrowserHistory()

const store = createStore(
  rootReducer,
  compose(
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

// For functional component hot reloading
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    renderWithHotReload(NextApp)
  })
}
