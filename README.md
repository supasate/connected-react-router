Connected React Router [![Build Status](https://travis-ci.org/supasate/connected-react-router.svg?branch=master)](https://travis-ci.org/supasate/connected-react-router)
======================
A Redux binding for React Router v4

Main features
-------------
:sparkles: Synchronize router state with redux store with uni-directional flow (history -> store -> router -> components).

:gift: Support [React Router v4](https://github.com/ReactTraining/react-router/tree/v4).

:sunny: Support functional component hot reloading while preserving state (with [react-hot-reload v3](https://github.com/gaearon/react-hot-loader/tree/next)).

:tada: Dispatching history methods (`push`, `replace`, `go`, `goBack`, `goForward`) work for both [redux-thunk](https://github.com/gaearon/redux-thunk) and [redux-saga](https://github.com/yelouafi/redux-saga).

:snowman: Nested children can access routing state such as current location directly with `react-redux`'s `connect`.

:clock9: Support time traveling in Redux DevTools.

Installation
-----------
Using [npm](https://www.npmjs.com/):

    $ npm install --save connected-react-router

Or [yarn](https://yarnpkg.com/):

    $ yarn add connected-react-router

Usage
-----
### Step 1

- Create a `history` object.
- Wrap the root reducer with `connectRouter` and supply the `history` object to get a new root reducer.
- Use `routerMiddleware(history)` if you want to dispatch history actions (ex. to change URL with `push('/path/to/somewhere')`).


```js
...
import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { connectRouter, routerMiddleware } from 'connected-react-router'
...
const history = createBrowserHistory()

const store = createStore(
  connectRouter(history)(rootReducer), // new root reducer with router state
  initialState,
  compose(
    applyMiddleware(
      routerMiddleware(history), // for dispatching history actions
      // ... other middlewares ...
    ),
  ),
)
```

### Step 2


- Wrap your react-router v4 routing with `ConnectedRouter` and pass `history` object as a prop.
- Place `ConnectedRouter` as children of `react-redux`'s `Provider`.

```js
...
import { Provider } from 'react-redux'
import { Match, Miss } from 'react-router' // react-router v4
import { ConnectedRouter } from 'connected-react-router'
...
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}> { /* place ConnectedRouter under Provider */ }
      <div> { /* your usual react-router v4 routing */ }
        <Match exactly pattern="/" render={() => (<div>Match</div>)} />
        <Miss render={() => (<div>Miss</div>)} />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('react-root')
)
```
Now, it's ready to work!


Examples
--------
See [examples](https://github.com/supasate/connected-react-router/tree/master/examples) folder

FAQ
---
- [How to navigate with Redux action](#how-to-navigate-with-redux-action)
- [How to get current URL path](#how-to-get-current-url-path)
- [How to hot reload functional components](#how-to-hot-reload-functional-components)
- [How to hot reload reducers](#how-to-hot-reload-reducers)

### How to navigate with Redux action
#### with store.dispatch
```js
import { push } from 'connected-react-router'

store.dispatch(push('/path/to/somewhere'))
```

#### in redux thunk
```js
import { push } from 'connected-react-router'

export const login = (username, password) => (dispatch) => {

  /* do something before redirection */

  dispatch(push('/home'))
}

```
#### in redux saga
```js
import { push } from 'connected-react-router'
import { put, call } from 'redux-saga/effects'

export function* login(username, password) {

  /* do something before redirection */

  yield put(push('/home'))
}
```

### How to get current URL path
The current URL path can be accessed directry from the router state with `react-redux`'s `connect`.
```js
import { connect } from 'react-redux'

const Child = ({ path }) => (
  <div>
    Child receives path {path}.
  </div>
)

const mapStateToProps = state => ({
  path: state.router.location.pathname,
})

export default connect(mapStateToProps)(Child)
```

### How to hot reload functional components
1) Separate main app component to another file.

`App.js`
``` js
import React from 'react'
import { Match, Miss } from 'react-router' /* react-router v4 */
import { ConnectedRouter } from 'connected-react-router'

const App = ({ history }) => ( /* receive history object via props */
  <ConnectedRouter history={history}>
    <div>
      <Match exactly pattern="/" render={() => (<div>Match</div>)} />
      <Miss render={() => (<div>Miss</div>)} />
    </div>
  </ConnectedRouter>
)

export default App
```

2) Wrap the `App` component with `AppContainer` from `react-hot-loader` v3 as a top-level container.

`index.js`
```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader' /* react-hot-loader v3 */
import App from './App'
...
const renderWithHotReload = (AppComponent) => { // this function will be reused
  ReactDOM.render(
    <AppContainer> { /* AppContainer for hot reloading v3 */ }
      <Provider store={store}>
        <AppComponent history={history} /> { /* pass history object as props */ }
      </Provider>
    </AppContainer>,
    document.getElementById('react-root')
  )
}

renderWithHotReload(App) // render
```

3) Detect change and re-render with hot reload.

`index.js`
``` js
...
if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default
    renderWithHotReload(NextApp)
  })
}
```
Now, when you change any component that `App` depends on, it will trigger hot reloading without losing redux state. Thanks [react-hot-loader v3](https://github.com/gaearon/react-hot-loader/tree/next)!

### How to hot reload reducers
Detect change and replace with a new root reducer with router state

`index.js`
``` js
...
if (module.hot) {
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers').default
    store.replaceReducer(connectRouter(history)(nextRootReducer)) // Need connectRouter to mount router state
  })
}
```

Build
-----
```bash
npm run build
```
Generated files will be in `lib` folder.

Cautions
--------
This is still an experimental project. It relies on several alpha and beta things (i.e. react-hot-loader v3 and react-router v4). Anything can be changed. Bugs are certainly waiting for you to wake them up. Please use it at your own risk.

Contributors
------------
See [Contributors](https://github.com/supasate/connected-react-router/graphs/contributors) and [Acknowledge](https://github.com/supasate/connected-react-router/blob/master/ACKNOWLEDGE.md).

License
-------
[MIT License](https://github.com/supasate/connected-react-router/blob/master/LICENSE.md)
