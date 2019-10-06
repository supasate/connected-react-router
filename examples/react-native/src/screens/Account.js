import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {getUrlParams} from '../utils/url';

const Account = ({history}) => {
  const urlParams = getUrlParams(history.location.search);
  const {accountId} = urlParams;
  return (
    <View>
      <Text style={styles.title}>Account {accountId}</Text>
      <Button
        color="blue"
        onPress={() => {
          history.go(-1);
        }}
        title="Back"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: '600',
  },
});

export default Account;
