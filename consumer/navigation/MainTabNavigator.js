import React from 'react';
import { Platform, AppRegistry, Text } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/Categories';
import ProfileScreen from '../screens/profile/Profile';
import MealsScreen from '../screens/Meals';
import MealScreen from '../screens/meal/Product';
import WebViewScreen from '../screens/WebView';
import MealModeScreen from '../screens/MealMode';
import FontText from '../screens/FontText';


const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: <FontText style={{fontFamily: 'Poor Story', textAlign: 'center'}}>Home</FontText>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}` : 'md-home'
      }
    />
  ),
};

const MealStack = createStackNavigator({
  MealMode: MealModeScreen,
  Categories: CategoryScreen,
  Meal: MealScreen,
  Meals: MealsScreen,
});

MealStack.navigationOptions = {
  tabBarLabel: <FontText style={{fontFamily: 'Poor Story', textAlign: 'center'}}>Meals</FontText>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-pizza${focused ? '' : '-outline'}` : 'md-pizza'}
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  WebView: WebViewScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: <FontText style={{fontFamily: 'Poor Story', textAlign: 'center'}}>Profile</FontText>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-person${focused ? '' : '-outline'}` : 'md-person'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  MealStack,
  ProfileStack,
});
