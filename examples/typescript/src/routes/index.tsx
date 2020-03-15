import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from '../components/Home'
import Hello from '../components/Hello'
import Counter from '../components/Counter'
import NoMatch from '../components/NoMatch'
import NavBar from '../components/NavBar'

const routes = (
  <div>
    <NavBar />
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/hello">
        <Hello />
      </Route>
      <Route path="/counter">
        <Counter />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  </div>
)
export default routes
