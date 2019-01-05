import React from 'react';
import { Platform, AppRegistry, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';

import TabBarIcon from '../components/TabBarIcon';
import LocationsScreen from '../screens/Locations';
import SettingsScreen from '../screens/settings/Settings';
import PersonalInfoScreen from '../screens/settings/PersonalInfo';
import DrawerScreen from '../screens/Drawer';
import ActiveMealsScreen from '../screens/ActiveMeals';
import AddMealScreen from '../screens/AddMeal';
import AddTemplateScreen from '../screens/AddTemplate';

const LocationsStack = createStackNavigator({
  Locations: LocationsScreen,
  ActiveMeals: ActiveMealsScreen,
},{
    defaultNavigationOptions: ({ navigation }) => ({
      headerStyle: {
        backgroundColor: '#2ECC71',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        textAlign: 'center',
        alignSelf: 'center',
        flex: 1,
      },
      headerRight: (<TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
      <Icon
           name='md-menu'
           type='ionicon'
           color='white'
           containerStyle={{backgroundColor: 'transparent', marginRight: 10}}
        /></TouchableOpacity>),
    })
  });

LocationsStack.navigationOptions = {
  tabBarLabel: <Text style={{fontFamily: 'Poor Story', textAlign: 'center', color: 'white'}}>Lockers</Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-map${focused ? '' : '-outline'}` : 'md-map'
      }
    />
  ),
  tabBarOptions: {
      style: {
          backgroundColor: '#2ECC71'
      }
  },
};

const AddMealStack = createStackNavigator({
  AddMeal: AddMealScreen,
  AddTemplate: AddTemplateScreen,
},{
      defaultNavigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#2ECC71',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          textAlign: 'center',
          alignSelf: 'center',
          flex: 1,
        },
        headerRight: (<TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
        <Icon
             name='md-menu'
             type='ionicon'
             color='white'
             containerStyle={{backgroundColor: 'transparent', marginRight: 10}}
          /></TouchableOpacity>),
      })
  });

AddMealStack.navigationOptions = {
  tabBarLabel: <Text style={{fontFamily: 'Poor Story', textAlign: 'center', color: 'white'}}>Add Meal</Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-filing${focused ? '' : '-outline'}` : 'md-filing'}
    />
  ),
  tabBarOptions: {
      style: {
          backgroundColor: '#2ECC71'
      }
  },
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
  PersonalInfo: PersonalInfoScreen,
},{
      defaultNavigationOptions: ({ navigation }) => ({
        headerStyle: {
          backgroundColor: '#2ECC71',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          textAlign: 'center',
          alignSelf: 'center',
          flex: 1,
        },
        headerRight: (<TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
        <Icon
             name='md-menu'
             type='ionicon'
             color='white'
             containerStyle={{backgroundColor: 'transparent', marginRight: 10}}
          /></TouchableOpacity>),
      })
  });

SettingsStack.navigationOptions = {
  tabBarLabel: <Text style={{fontFamily: 'Poor Story', textAlign: 'center', color: 'white'}}>Settings</Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-cog${focused ? '' : '-outline'}` : 'md-cog'}
    />
  ),
  tabBarOptions: {
      style: {
          backgroundColor: '#2ECC71'
      }
  },
};

const TabNavigator = createBottomTabNavigator({
  LocationsStack,
  AddMealStack,
  SettingsStack,
},{
     headerMode: "none"
 });

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: TabNavigator,
  }},{
        contentComponent: DrawerScreen,
        drawerWidth: Dimensions.get('window').width - 120,
        drawerPosition: 'right',
    });


export default createStackNavigator({
  DrawerNavigator,
}, {
    headerMode: "none"
});

