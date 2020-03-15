import React from 'react';
import {ConnectedRouter} from 'connected-react-router';
import {NativeRouter, Route} from 'react-router-native';
import Home from '../screens/Home';
import Account from '../screens/Account';

const Router = ({history}) => (
  <NativeRouter>
    <ConnectedRouter history={history}>
      <Route path="/" exact={true}>
        <Home />
      </Route>
      <Route path="/account">
        <Account />
      </Route>
    </ConnectedRouter>
  </NativeRouter>
);

export default Router;
