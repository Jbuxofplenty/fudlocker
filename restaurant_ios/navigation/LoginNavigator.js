import React from 'react';
import { Platform, AppRegistry, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/SignUp';

const AppNavigator = createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
}, {
    headerMode: "none"
});

const App = createAppContainer(AppNavigator);
export default App;