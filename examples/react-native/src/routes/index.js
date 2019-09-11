import React from 'react';
import {ConnectedRouter} from 'connected-react-router';
import {NativeRouter, Route} from 'react-router-native';
import Home from '../screens/Home';
import Account from '../screens/Account';

const Router = ({history}) => (
  <NativeRouter>
    <ConnectedRouter history={history}>
      <Route path="/" component={Home} exact={true} />
      <Route path="/account" component={Account} />
    </ConnectedRouter>
  </NativeRouter>
);

export default Router;
