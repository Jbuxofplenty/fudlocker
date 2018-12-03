import React from 'react';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';

import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';

import { Scene, Router, Actions } from 'react-native-router-flux';
import AppNavigator from './navigation/AppNavigator';


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
          return <AppNavigator/>
        }
        else {
          return <SignUpScreen screenProps={{ isLoggedIn: () => this.setState({ loggedInStatus: 'loggedIn' }) }}/>
        }
  }
}

const scenes = Actions.create(
  <Scene key="root">
        <Scene key="signup" component={SignUpScreen} initial={true}/>
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
