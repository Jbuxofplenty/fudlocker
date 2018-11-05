import React, { Component } from "react";
import { LinearGradient } from 'expo';
import styles from "./Style";


import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView} from 'react-native';
import { Button } from 'react-native-elements';
import {Image} from 'react-native' ;
import { Scene, Router, Actions } from 'react-native-router-flux';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
  }

  logInUser() {
    // logic to log in user through your server/API/whatever
    this.props.screenProps.isLoggedIn(); // sets state in parent component which will now update and render Home
    // set logged in status in AsyncStorage
  }


  render() {
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

            <TextInput placeholder="Username" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} />
            <TextInput placeholder="Password" placeholderColor="#c4c3cb" style={styles.loginFormTextInput} secureTextEntry={true}/>
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => this.logInUser()}
              title="Login"
            />
            <Button
              buttonStyle={styles.fbLoginButton}
              onPress={() => this.onFbLoginPress()}
              title="Login with Facebook"
              color="#3897f1"
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  componentDidMount() {
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
