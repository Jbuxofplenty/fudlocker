import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import LoginScreen from './screens/Login.js'
import HomeScreen from './screens/HomeScreen.js'
import { Scene, Router, Actions } from 'react-native-router-flux';

export default class App extends React.Component {
  render() {
    return (
      <Router scenes={scenes}/>
    );
  }
}

const scenes = Actions.create(
  <Scene key="root">
        <Scene key="login" component={LoginScreen} initial={true}/>
        <Scene key="home" component={HomeScreen}/>
  </Scene>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
