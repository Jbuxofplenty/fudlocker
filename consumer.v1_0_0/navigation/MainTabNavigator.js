import React from 'react';
import { Platform, AppRegistry, Text } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/Categories';
import ProfileScreen from '../screens/profile/Profile';
import MealsScreen from '../screens/Meals';
import MealScreen from '../screens/Meal';
import WebViewScreen from '../screens/WebView';
import MealModeScreen from '../screens/MealMode';
import SearchScreen from '../screens/Search';
import LocationScreen from '../screens/Location';
import PersonalInfoScreen from '../screens/profile/PersonalInfo';
import MealRadiusScreen from '../screens/profile/MealRadius';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Search: SearchScreen,
  Location: LocationScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: <Text style={{fontFamily: 'Poor Story', textAlign: 'center', color: 'white'}}>Home</Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home${focused ? '' : '-outline'}` : 'md-home'
      }
    />
  ),
  tabBarOptions: {
      style: {
          backgroundColor: '#2ECC71'
      }
  },
};

const MealStack = createStackNavigator({
  MealMode: MealModeScreen,
  Categories: CategoryScreen,
  Meal: MealScreen,
  Meals: MealsScreen,
});

MealStack.navigationOptions = {
  tabBarLabel: <Text style={{fontFamily: 'Poor Story', textAlign: 'center', color: 'white'}}>Meals</Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-pizza${focused ? '' : '-outline'}` : 'md-pizza'}
    />
  ),
  tabBarOptions: {
      style: {
          backgroundColor: '#2ECC71'
      }
  },
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
  WebView: WebViewScreen,
  MealRadius: MealRadiusScreen,
  PersonalInfo: PersonalInfoScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: <Text style={{fontFamily: 'Poor Story', textAlign: 'center', color: 'white'}}>Profile</Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-person${focused ? '' : '-outline'}` : 'md-person'}
    />
  ),
  tabBarOptions: {
      style: {
          backgroundColor: '#2ECC71'
      }
  },
};

export default createBottomTabNavigator({
  HomeStack,
  MealStack,
  ProfileStack,
});
