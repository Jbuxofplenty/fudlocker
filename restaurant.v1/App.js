import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';

import { Scene, Router, Actions } from 'react-native-router-flux';
import AppNavigator from './navigation/AppNavigator';
import LoginNavigator from './navigation/LoginNavigator';
import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state ={ isLoggedIn: false };
  }

  componentDidMount() {
    AsyncStorage.getItem('loggedInStatus',
    (value) => {
      this.setState({ loggedInStatus: value });
    });
  }

  render() {
        if (this.state.loggedInStatus === 'loggedIn') {
          return <AppNavigator screenProps={{ isLoggedIn: () => this.setState({ loggedInStatus: 'loggedOut' }) }}/>
        }
        else {
          return <LoginNavigator screenProps={{ isLoggedIn: () => this.setState({ loggedInStatus: 'loggedIn' }) }}/>
        }
  }
}

const scenes = Actions.create(
  <Scene key="root">
        <Scene key="login" component={LoginNavigator} initial={true}/>
        <Scene key="app" component={AppNavigator}/>
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
