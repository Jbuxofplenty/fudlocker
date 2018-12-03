import React, { Component } from "react";
import { LinearGradient, Font } from 'expo';
import styles from "./Style";
import { NavigationActions } from 'react-navigation';

import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView} from 'react-native';
import { Button } from 'react-native-elements';
import {Image} from 'react-native' ;

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
  }

  logInUser() {
    // logic to log in user through your server/API/whatever
    this.props.screenProps.isLoggedIn(); // sets state in parent component which will now update and render Home
    // set logged in status in AsyncStorage
  }

  state = {
    fontLoaded: false,
  }
  async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
    }

  render() {
      if (this.state.fontLoaded){
    return (
      <KeyboardAvoidingView style={styles.containerView} behavior="padding">

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.loginScreenContainer}>
          <View style={styles.loginFormView}>

          <LinearGradient
                    colors={['#ABEBC6', '#2ECC71']}
                    style={styles.loginScreenGradient}
                  />

          <Image style={styles.loginScreenLogo}
            source={require("./../assets/images/fudlkr_logo.png")}
          />
            <TextInput placeholder="Email Address" placeholderColor="#c4c3cb" style={[styles.loginFormTextInput, {fontSize: 16, fontFamily: 'Poor Story'}]} secureTextEntry={true}/>
            <TextInput placeholder="Username" placeholderColor="#c4c3cb" style={[styles.loginFormTextInput, {fontSize: 16, fontFamily: 'Poor Story'}]} />
            <TextInput placeholder="Password" placeholderColor="#c4c3cb" style={[styles.loginFormTextInput, {fontSize: 16, fontFamily: 'Poor Story'}]} secureTextEntry={true}/>
            <TextInput placeholder="Confirm Password" placeholderColor="#c4c3cb" style={[styles.loginFormTextInput, {fontSize: 16, fontFamily: 'Poor Story'}]} secureTextEntry={true}/>
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => this.logInUser()}
              title="Sign Up!"
              textStyle={{fontSize: 30, fontFamily: 'Poor Story'}}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
    }
    else {
        return null
    }
  }

  componentWillUnmount() {
  }

  onLoginPress(props) {

  }

  async onFbLoginPress() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(appId, {
      permissions: ['public_profile', 'email'],
    });
    if (type === 'success') {
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      Alert.alert(
        'Logged in!',
        `Hi ${(await response.json()).name}!`,
      );
    }
  }
}
