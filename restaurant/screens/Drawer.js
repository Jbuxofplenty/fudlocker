import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, Button, TouchableOpacity, TouchableHighlight, SectionList, Keyboard, ScrollView, Dimensions, AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { Font, LinearGradient } from 'expo';
import { Avatar, ListItem, Icon } from 'react-native-elements';
import BaseIcon from './settings/Icon';
import InfoText from './settings/InfoText';
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

    async populateInfo() {
        //Get the current userID
        await firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                //Get the user data
                firebase.database().ref('/users/' + user.uid).on('value', function(snapshot) {
                   this.setState({ name: snapshot.val().name });
                   this.setState({ email: snapshot.val().email });
                   this.setState({ headshot: snapshot.val().headshot });
                }.bind(this));
            } else {
              // No user is signed in.
              AsyncStorage.setItem('isLoggedIn', JSON.stringify(false));
              firebase.auth().signOut();
              this.props.screenProps.isLoggedIn();
            }
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
     await this.populateInfo();
     this.setState({ fontLoaded: true });

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
    if(this.state.headshot == null) {
        return null
    }
    else {
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
                        <Text style={{fontFamily: 'Poor Story', fontSize: 20, color: 'black'}}>Fudlkr Locations</Text>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => {this.navigateToScreen('Locations')}}>
                          <ListItem
                            // chevron
                            title="Locations"
                            titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                              <BaseIcon
                                containerStyle={{ backgroundColor: 'transparent' }}
                                icon={{
                                  type: 'ionicon',
                                  name: 'md-map',
                                }}
                              />
                            }
                            rightIcon={<Chevron/>}
                          />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.categoryContainer}>
                        <Text style={{fontFamily: 'Poor Story', fontSize: 20, color: 'black'}}>Meal Inventory</Text>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => {this.navigateToScreen('AddMeal')}}>
                          <ListItem
                            // chevron
                            title="Add Meal"
                            titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                            containerStyle={styles.listItemContainer}
                            leftIcon={
                              <BaseIcon
                                containerStyle={{ backgroundColor: 'transparent' }}
                                icon={{
                                  type: 'ionicon',
                                  name: 'md-filing',
                                }}
                              />
                            }
                            rightIcon={<Chevron/>}
                          />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => {this.props.navigation.navigate('AddTemplate', {
                                                    'title': "Add New Template",
                                                    'img': "https://s3-us-west-1.amazonaws.com/fudlkr.com/mobile_assets/green.png",
                                                    'detail': "",
                                                    'cost': "",
                                                    'calories': "",
                                                    'strCategory': "",
                                                    'location': "",
                                                    'idMeal': "",
                                                    'shelfLife': "",
                                                    'templateData': {"strMealThumb": "https://s3-us-west-1.amazonaws.com/fudlkr.com/mobile_assets/green.png"}});
                                                    this.props.navigation.dispatch(DrawerActions.closeDrawer());}}>
                        <ListItem
                          // chevron
                          title="Add Template"
                          titleStyle={{fontFamily: 'Poor Story', fontSize: 16, color: 'white'}}
                          rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15, color: 'white' }}
                          containerStyle={styles.listItemContainer}
                          leftIcon={
                            <BaseIcon
                              containerStyle={{ backgroundColor: 'transparent' }}
                              icon={{
                                type: 'ionicon',
                                name: 'md-add',
                              }}
                            />
                          }
                          rightIcon={<Chevron/>}
                        />
                    </TouchableOpacity>
                      </View>
                    <View style={styles.categoryContainer}>
                        <Text style={{fontFamily: 'Poor Story', fontSize: 20, color: 'black'}}>Account</Text>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => this.navigateToScreen('Settings')}>
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
