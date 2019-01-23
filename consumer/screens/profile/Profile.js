import React, { Component } from 'react'
import { ScrollView, Switch, StyleSheet, Text, View, Share, WebView, Linking, TouchableOpacity } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import { Font } from 'expo'
import Rate, { AndroidMarket } from 'react-native-rate'
import ToggleSwitch from 'toggle-switch-react-native'
import * as firebase from 'firebase';

import BaseIcon from './Icon'
import Chevron from './Chevron'
import InfoText from './InfoText'
import FontText from '../FontText'

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
})

class SettingsScreen extends Component {
  static navigationOptions = {
      title: 'Settings',
      headerStyle: {
        backgroundColor: '#2ECC71',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        textAlign: 'center',
        alignSelf: 'center',
        flex: 1,
      },
      headerLeft: (<View></View>),
  };
  state = {
    pushNotifications: true,
    fontLoaded: false,
    mealRadius: null,
    name: null,
    email: null,
    headshot: null,
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Poor Story': require('../../assets/fonts/PoorStory-Regular.ttf'),
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

   populateInfo() {
     //Get the current userID
     var userId = firebase.auth().currentUser.uid;
     //Get the user data
     return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
         this.setState({ name: snapshot.val().name });
         this.setState({ email: snapshot.val().email });
         this.setState({ mealRadius: snapshot.val().mealRadius });
         this.setState({ headshot: snapshot.val().headshot});
     }.bind(this));
   }

  shareApp = () => {
      Share.share({
        message: 'Hey, check out this new app I found where you can use meal swipes outside normal business hours outside of the C4C!',
        url: 'http://fudlkr.com',
        title: 'Fudlkr Application'
      }, {
        // Android only:
        dialogTitle: 'Share Fudlkr',
        // iOS only:
        excludedActivityTypes: [
          'com.apple.UIKit.activity.PostToTwitter'
        ]
      })

  }
  rateUs = () => {
        let options = {
              AppleAppID:"",
              GooglePackageName:"com.fudlkr.consumer",
              AmazonPackageName:"com.fudlkr.consumer",
              preferredAndroidMarket: AndroidMarket.Google,
              preferInApp:false,
              openAppStoreIfInAppFails:true,
              fallbackPlatformURL:"http://www.fudlkr.com/index.html",
          }

          Rate.rate(options, success=>{
              if (success) {
                  // this technically only tells us if the user successfully went to the Review Page. Whether they actually did anything, we do not know.
                  this.setState({rated:true})
              }
          })
  }
  onChangePushNotifications = () => {
    this.setState(state => ({
      pushNotifications: !state.pushNotifications,
    }))
  }
  openURI(uri, title){
    this.props.navigation.navigate('WebView', {uri:uri, title: title})
  }

  render() {
    if (this.state.fontLoaded && this.state.name != null ){
    return (
      <ScrollView style={styles.scroll}>
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('PersonalInfo')}
        >
        <View style={styles.userRow}>
          <View style={styles.userImage}>
            <Avatar
              rounded
              size="large"
              source={{
                uri: this.state.headshot,
              }}
            />
          </View>
          <View>
            <Text style={{ fontFamily: 'Poor Story', fontSize: 16 }}>{this.state.name}</Text>
            <Text
              style={{
                color: 'gray',
                fontSize: 16,
                fontFamily: 'Poor Story',
              }}
            >
              {this.state.email}
            </Text>
           </View>
        </View>
        </TouchableOpacity>
        <InfoText text="Account" />
        <View>
          <ListItem
            title="Push Notifications"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#FFADF2',
                }}
                icon={{
                  type: 'material',
                  name: 'notifications',
                }}
              />
            }
            rightIcon={
              <ToggleSwitch
                  isOn={this.state.pushNotifications}
                  onColor='green'
                  offColor='grey'
                  size='small'
                  onToggle={this.onChangePushNotifications}
              />
            }
          />
          <ListItem
            // chevron
            title="Meal Radius"
            rightTitle={this.state.mealRadius + " miles"}
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15 }}
            onPress={() => this.props.navigation.navigate('MealRadius', {radius: this.state.mealRadius})}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FAD291' }}
                icon={{
                  type: 'ionicon',
                  name: 'md-locate',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Payment Information"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15 }}
            onPress={() => this.props.navigation.navigate('PaymentInfo')}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#57DCE7' }}
                icon={{
                  type: 'font-awesome',
                  name: 'money',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
        <InfoText text="More" />
        <View>
          <ListItem
            title="About Us"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.openURI("http://fudlkr.com/index.html", "About Us")}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#A4C8F0' }}
                icon={{
                  type: 'ionicon',
                  name: 'md-information-circle',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Terms and Policies"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.openURI("http://fudlkr.com/conditions.html", "Terms and Policies")}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#C6C7C6' }}
                icon={{
                  type: 'entypo',
                  name: 'light-bulb',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Share our App"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.shareApp()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#C47EFF',
                }}
                icon={{
                  type: 'entypo',
                  name: 'share',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Rate Us"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.rateUs()}
            containerStyle={styles.listItemContainer}
            badge={{
              value: 5,
              textStyle: { color: 'white', fontFamily: 'Poor Story', fontSize: 16 },
              containerStyle: { backgroundColor: 'gray', marginTop: 0, marginRight: 15 },
            }}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#FECE44',
                }}
                icon={{
                  type: 'entypo',
                  name: 'star',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Send FeedBack"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.openURI("http://fudlkr.com/signup.html", "Send Feedback")}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#00C001',
                }}
                icon={{
                  type: 'materialicon',
                  name: 'feedback',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
      </ScrollView>
    )}
    else {
        return null
    }
  }
}

export default SettingsScreen
