import React from 'react';
import { Platform, AppRegistry, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { createStackNavigator, createBottomTabNavigator, createDrawerNavigator } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { Icon } from 'react-native-elements';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/Categories';
import ProfileScreen from '../screens/profile/Profile';
import MealsScreen from '../screens/Meals';
import OrdersScreen from '../screens/Orders';
import OrderModeScreen from '../screens/OrderMode';
import OrderScreen from '../screens/Order';
import MealScreen from '../screens/Meal';
import WebViewScreen from '../screens/WebView';
import MealModeScreen from '../screens/MealMode';
import SearchScreen from '../screens/Search';
import LocationScreen from '../screens/Location';
import PurchaseScreen from '../screens/Purchase';
import PersonalInfoScreen from '../screens/profile/PersonalInfo';
import MealRadiusScreen from '../screens/profile/MealRadius';
import PaymentInfoScreen from '../screens/profile/PaymentInfo';
import AddCardScreen from '../screens/profile/AddNewCard';
import DrawerScreen from '../screens/Drawer';
import AddPictureScreen from '../screens/AddPicture';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Search: SearchScreen,
  Location: LocationScreen,
  Profile: ProfileScreen,
  WebView: WebViewScreen,
  MealRadius: MealRadiusScreen,
  PersonalInfo: PersonalInfoScreen,
  PaymentInfo: PaymentInfoScreen,
  AddNewCard: AddCardScreen,
  AddPicture: AddPictureScreen,
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
  Purchase: PurchaseScreen,
  AddPurchaseCard: AddCardScreen,
  Profile: ProfileScreen,
  WebView: WebViewScreen,
  MealRadius: MealRadiusScreen,
  PersonalInfo: PersonalInfoScreen,
  PaymentInfo: PaymentInfoScreen,
  AddNewCard: AddCardScreen,
  AddPicture: AddPictureScreen,
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

const OrderStack = createStackNavigator({
  OrderMode: OrderModeScreen,
  Order: OrderScreen,
  Orders: OrdersScreen,
  Profile: ProfileScreen,
  WebView: WebViewScreen,
  MealRadius: MealRadiusScreen,
  PersonalInfo: PersonalInfoScreen,
  PaymentInfo: PaymentInfoScreen,
  AddNewCard: AddCardScreen,
  AddPicture: AddPictureScreen,
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

OrderStack.navigationOptions = {
  tabBarLabel: <Text style={{fontFamily: 'Poor Story', textAlign: 'center', color: 'white'}}>Orders</Text>,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-pricetag${focused ? '' : '-outline'}` : 'md-pricetag'}
    />
  ),
  tabBarOptions: {
      style: {
          backgroundColor: '#2ECC71'
      }
  },
};

const TabNavigator = createBottomTabNavigator({
  HomeStack,
  MealStack,
  OrderStack,
},{
     headerMode: "none"
 });

const DrawerNavigator = createDrawerNavigator({
  Home: {
    screen: TabNavigator,
  }}, {
        contentComponent: DrawerScreen,
        drawerWidth: Dimensions.get('window').width - 120,
        drawerPosition: 'right',
    });


export default createStackNavigator({
  DrawerNavigator,
}, {
    headerMode: "none"
});

