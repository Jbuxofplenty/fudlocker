import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, Button, TouchableOpacity, TouchableHighlight, SectionList, Keyboard, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { Font, LinearGradient } from 'expo';
import { Avatar, ListItem, Icon } from 'react-native-elements'
import BaseIcon from './profile/Icon'
import InfoText from './profile/InfoText'
import FontText from './FontText'
import * as firebase from 'firebase';

const Chevron = () => (
  <Icon
    name="chevron-right"
    type="entypo"
    color="white"
    containerStyle={{ marginLeft: -15, width: 20 }}
  />
)

class DrawerScreen extends Component {
   state = {
       fontLoaded: false,
       name: null,
       email: null,
       headshot: null,
     }

   populateInfo() {
     //Get the current userID
     var userId = firebase.auth().currentUser.uid;
     //Get the user data
     return firebase.database().ref('/users/' + userId).on('value', function(snapshot) {
         this.setState({ name: snapshot.val().name });
         this.setState({ email: snapshot.val().email });
         this.setState({ headshot: snapshot.val().headshot });
     }.bind(this));
   }

 async componentDidMount() {
   await Font.loadAsync({
     'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
   });
   await Font.loadAsync({
     'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf')
   });
   await Font.loadAsync({
     'Entypo': require('@expo/vector-icons/fonts/Entypo.ttf')
   });
   await Font.loadAsync({
     'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf')
   });

   this.setState({ fontLoaded: true });
   this.populateInfo();

 }
  navigateToScreen = (route) => {
    this.props.navigation.navigate(route);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  }
  async logOutUser() {
    await AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
    await firebase.auth().signOut();
    this.props.screenProps.isLoggedIn();
  }

  render () {
    if(this.state.email != null && this.state.headshot != null) {
        return (
          <View style={{paddingVertical: 40}}>
          <LinearGradient
              colors={['#2ECC71', '#2ECC71']}
              style={styles.loginScreenGradient}
            />
            <ScrollView style={styles.scroll}>
                    <TouchableOpacity
                        onPress={() => this.navigateToScreen('PersonalInfo')}
                    >
                    <View style={styles.userImage}>
                        <Avatar
                          rounded
                          xlarge
                          source={{
                            uri: this.state.headshot,
                          }}
                        />
                      </View>
                    <View style={styles.userRow}>
                      <View>
                        <Text style={{ fontFamily: 'Poor Story', fontSize: 16, color: 'white', alignSelf: 'center' }}>{this.state.name}</Text>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 16,
                            fontFamily: 'Poor Story',
                            alignSelf: 'center'
                          }}
                        >
                          {this.state.email}
                        </Text>
                       </View>
                    </View>
                    </TouchableOpacity>
                    <View style={styles.categoryContainer}>
                        <Text style={{fontFamily: 'Poor Story', fontSize: 20, color: 'black'}}>Browse</Text>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => {this.navigateToScreen('Home')}}>
                          <ListItem
                            // chevron
                            title="Home"
                            titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                              <BaseIcon
                                containerStyle={{ backgroundColor: 'transparent' }}
                                icon={{
                                  type: 'ionicon',
                                  name: 'md-home',
                                }}
                              />
                            }
                            rightIcon={<Chevron/>}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {this.navigateToScreen('Categories')}}>
                          <ListItem
                            title="Cuisine Categories"
                            titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                              <BaseIcon
                                containerStyle={{ backgroundColor: 'transparent' }}
                                icon={{
                                  type: 'ionicon',
                                  name: 'md-pizza',
                                }}
                              />
                            }
                            rightIcon={<Chevron />}
                          />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.categoryContainer}>
                        <Text style={{fontFamily: 'Poor Story', fontSize: 20, color: 'black'}}>Orders</Text>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => {this.props.navigation.navigate('Orders', {order_type: "Current", title: "Current Orders"})}}>
                          <ListItem
                            // chevron
                            title="Current Orders"
                            titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                              <BaseIcon
                                containerStyle={{ backgroundColor: 'transparent' }}
                                icon={{
                                  type: 'ionicon',
                                  name: 'md-pricetag',
                                }}
                              />
                            }
                            rightIcon={<Chevron/>}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Orders', {order_type: "History", title: "Order History"})}>
                          <ListItem
                            title="Order History"
                            titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                              <BaseIcon
                                containerStyle={{ backgroundColor: 'transparent' }}
                                icon={{
                                  type: 'ionicon',
                                  name: 'md-list',
                                }}
                              />
                            }
                            rightIcon={<Chevron />}
                          />
                      </TouchableOpacity>
                      </View>
                    <View style={styles.categoryContainer}>
                        <Text style={{fontFamily: 'Poor Story', fontSize: 20, color: 'black'}}>Account</Text>
                    </View>
                    <View>
                    <TouchableOpacity onPress={() => {this.props.navigation.navigate('MealRadius', {radius: 1.5});this.props.navigation.dispatch(DrawerActions.closeDrawer());}}>
                          <ListItem
                            // chevron
                            title="Meal Radius"
                            titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                              <BaseIcon
                                containerStyle={{ backgroundColor: 'transparent' }}
                                icon={{
                                  type: 'ionicon',
                                  name: 'md-locate',
                                }}
                              />
                            }
                            rightIcon={<Chevron/>}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.navigateToScreen('PaymentInfo')}>
                          <ListItem
                            title="Payment Information"
                            titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                              <BaseIcon
                                containerStyle={{ backgroundColor: 'transparent' }}
                                icon={{
                                  type: 'font-awesome',
                                  name: 'money',
                                }}
                              />
                            }
                            rightIcon={<Chevron />}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.navigateToScreen('Profile')}>
                          <ListItem
                              title="Settings"
                              titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                              rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                              containerStyle={styles.listItemContainer}
                              leftIcon={
                                <BaseIcon
                                  containerStyle={{ backgroundColor: 'transparent' }}
                                  icon={{
                                    type: 'ionicon',
                                    name: 'md-cog',
                                  }}
                                />
                              }
                              rightIcon={<Chevron />}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.logOutUser()}>
                            <ListItem
                              title="Log Out"
                              titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                              rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                              containerStyle={styles.listItemContainer}
                              leftIcon={
                                <BaseIcon
                                  containerStyle={{ backgroundColor: 'transparent' }}
                                  icon={{
                                    type: 'ionicon',
                                    name: 'md-log-out',
                                  }}
                                />
                              }
                              rightIcon={<Chevron />}
                            />
                        </TouchableOpacity>
                    </View>
                  </ScrollView>
          </View>
        );
    }
    else {
        return null
    }
  }
}

export default DrawerScreen;
const styles = StyleSheet.create({
    loginScreenGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: Dimensions.get('window').height,
    },
      scroll: {
        backgroundColor: 'transparent',
      },
      userRow: {
        alignItems: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 10,
      },
      userImage: {
        marginRight: 12,
        alignSelf: 'center',
      },
      listItemContainer: {
        height: 55,
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderLeftWidth: 0,
        borderColor: 'white',
      },
      categoryContainer: {
       height: 30,
       backgroundColor: 'white',
       alignItems: 'center',
       paddingTop: 5
     },
});
