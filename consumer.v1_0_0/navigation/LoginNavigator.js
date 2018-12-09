import React from 'react';
import { Platform, AppRegistry, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation';

import LoginScreen from '../screens/Login';
import SignUpScreen from '../screens/SignUp';

export default createStackNavigator({
  Login: LoginScreen,
  SignUp: SignUpScreen,
}, {
    headerMode: "none"
});