Connected React Router
======================
A Redux binding for React Router v4

Main features
-------------
:sparkles: Synchronize router state with redux store with uni-directional flow (history -> store -> router -> components)

:gift: Support [React Router v4](https://github.com/ReactTraining/react-router/tree/v4)

:sunny: Support Hot reloading while preserving state (with [react-hot-reload v3](https://github.com/gaearon/react-hot-loader/tree/next))

:tada: Dispatching history methods (push, replace, go, goBack, goForward) are available for both [redux-thunk](https://github.com/gaearon/redux-thunk) and [redux-saga](https://github.com/yelouafi/redux-saga)

:snowman: Nested children can access routing state such as current location directly with redux's `connect`

Installation
-----------
Using [npm](https://www.npmjs.com/):

    $ npm install --save connected-react-router

Or [yarn](https://yarnpkg.com/):

    $ yarn add connected-react-router

Usage
-----
### Step 1

In your root reducer, mount `routerReducer` as `router`.
``` js
import { combineReducers } from 'redux'
import { routerReducer } from 'connected-react-router'

const rootReducer = combineReducers({
  // ... other reducers ...
  router: routerReducer, // **Must** mounted as `router`
})
```


### Step 2

Create a `history` object and create redux store with `routerMiddleware`.
Supply the `history` object to `routerMiddleware` and call `syncHistoryWithStore` with created `history` and `store`.
```js
import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware, syncHistoryWithStore } from 'connected-react-router'

const history = createBrowserHistory()

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(
      routerMiddleware(history),
      // ... other middlewares ...
    ),
  ),
)

syncHistoryWithStore(history, store)
```

### Step 3

Wrap your react-router v4 routing with `ConnectedRouter` and pass `history` object as a prop.
Place `ConnectedRouter` as children of `react-redux`'s `Provider`.

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Match, Miss } from 'react-router' // react-router v4
import { AppContainer } from 'react-hot-loader' // react-hot-loader v3
import { ConnectedRouter } from 'connected-react-router'
...
ReactDOM.render(
  <AppContainer>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div>
          { /* ... your usual react-router v4 routing ... */ }
          <Match exactly pattern="/" render={() => (<div>Match</div>)} />
          <Miss render={() => (<div>Miss</div> />
        </div>
      </ConnectedRouter>
    </Provider>
  </AppContainer>,
  document.getElementById('react-root'),
```
Now, it's ready to work!

*Note: Use `AppContainer` for functional component hot reloading. It's optional.*

## Examples
See [examples](https://github.com/supasate/connected-react-router/tree/master/examples) folder

## How to navigate with Redux action
### with store.dispatch
```js
import { push } from 'connected-react-router'

store.dispatch(push('/path/to/somewhere'))
```

### in redux thunk
```js
import { push } from 'connected-react-router'

export const login = (username, password) => (dispatch) => {

  /* do something before redirection */

  dispatch(push('/home'))
}

```
### in redux saga
```js
import { push } from 'connected-react-router'
import { put, call } from 'redux-saga/effects'

export function* login(username, password) {

  /* do something before redirection */

  yield put(push('/home'))
}
```

## How nested children access the router state (e.g. URL path)
The router state can be accessed directly with `react-redux`'s `connect`
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

## Cautions
This is experimental project. It relies on several alpha and beta things (i.e. react-hot-loader v3 and react-router v4). Anything can be changed. Bugs are certainly waiting for you to wake them up. Please use it at your own risk.

## Todos
- Add tests
- Make it work with time travel feature of Redux DevTools

## Acknowledge
Connected React Router is based on several awesome people' ideas
- Several parts of Connected React Router is based on [react-router-redux v4](https://github.com/reactjs/react-router-redux/tree/v4.0.7).
- A [PR](https://github.com/reactjs/react-router-redux/pull/460) by @timdorr to make react-router-redux v5 to integrate React Router v4 contains several ideas to drive Connected React Router.
- The ConnectedRouter component is inspired by [App component by @cherijs](https://github.com/lourd/react-router4-redux-example/blob/master/src/App.js) with history synchronization enhancement.
- The idea of uni-directional flow (history -> store -> router -> components) is from [a @lourd's comment](https://github.com/reactjs/react-router-redux/pull/460#issuecomment-260999726)

## License
MIT License
