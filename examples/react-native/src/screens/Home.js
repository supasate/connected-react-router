import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';

const Home = ({history}) => (
  <View>
    <Text style={styles.title}>Home</Text>
    <Button
      color="blue"
      onPress={() => {
        history.push({
          pathname: '/account',
          search: '?accountId=42',
        });
      }}
      title="Go to account with accountId: 42"
    />
  </View>
);

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default Home;
