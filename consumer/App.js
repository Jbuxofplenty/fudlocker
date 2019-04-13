import React from 'react';
import { Font } from 'expo';
import { AsyncStorage, StyleSheet, Text, View } from 'react-native';

import LoginScreen from './screens/Login';
import SignUpScreen from './screens/SignUp';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/profile/Profile';
import MealScreen from './screens/Meal';
import * as firebase from 'firebase';

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
        this.state ={
            isLoggedIn: "waiting" };
    }
  

    async checkLoggedIn() {
        var value = false;
        try {
           value = await AsyncStorage.getItem('isLoggedIn');
        } catch (error) {
          value = false;
        }
        if(value !== null) {
            value = JSON.parse(value);
        }
        return value;
    }

    async componentDidMount() {
        var isLoggedIn = await this.checkLoggedIn();
        await Font.loadAsync({
            'Poor Story': require('./assets/fonts/PoorStory-Regular.ttf'),
        });
        await firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
            this.setState({ isLoggedIn });
          } else {
            this.setState({ isLoggedIn: false });
          }
        }.bind(this));
    }


  render() {
        if(this.state.isLoggedIn === "waiting"){
            return null;
        }
        if (this.state.isLoggedIn) {
          return <AppNavigator screenProps={{ isLoggedIn: () => this.setState({ isLoggedIn: false }) }}/>
        }
        else {
          return <LoginNavigator screenProps={{ isLoggedIn: () => this.setState({ isLoggedIn: true }) }}/>
        }
  }
}

const scenes = Actions.create(
  <Scene key="root">
        <Scene key="login" component={LoginScreen} initial={true}/>
        <Scene key="app" component={AppNavigator}/>
        <Scene key="home" component={HomeScreen}/>
        <Scene key="profile" component={ProfileScreen}/>
        <Scene key="meal" component={MealScreen}/>
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
