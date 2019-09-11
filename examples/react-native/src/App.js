/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';
import Router from './routes';
import configureStore from './configureStore';

const {history, store} = configureStore();

const App = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Provider store={store}>
          <Router history={history} />
        </Provider>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default App;
