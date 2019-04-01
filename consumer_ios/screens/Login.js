import React, { Component } from "react";
import { LinearGradient, Font } from 'expo';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';
import * as EmailValidator from 'email-validator';

import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView, Modal, Dimensions, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';
import {Image} from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
  }
    verifyUserData() {
        let validated = true;
        if(EmailValidator.validate(this.state.email)) {
            this.setState({ emailColor: 'green' });
        }
        else {
            validated = false;
            this.setState({ emailColor: 'red' });
            this.setState({ errorMessage: 'Email formatted incorrectly!'});
            this.setState({ modalVisible: true });
            return validated;
        }
        if(this.state.pass.length > 5) {
            this.setState({ passColor: 'green' });
        }
        else {
            validated = false;
            this.setState({ passColor: 'red' });
            this.setState({ errorMessage: 'Password formatted incorrectly! It must be at least 6 characters long.'});
            this.setState({ modalVisible: true });
            return validated;
        }

        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass).then((authData) => {
               this.logInUser();
            }).catch(function(error) {
             // Handle Errors here.
             var errorCode = error.code;
             var errorMessage = error.message;
             if (errorCode === 'auth/wrong-password') {
               this.setState({ passColor: 'red' });
               this.setState({ errorMessage: 'Password Incorrect!'});
               this.setState({ modalVisible: true });
             } else {
               this.setState({ emailColor: 'red' });
               this.setState({ passColor: 'red' });
               this.setState({ errorMessage: 'Email and/or Password Incorrect!'});
               this.setState({ modalVisible: true });
             }
           }.bind(this));
        return validated;
      }
  logInUser() {
    // logic to log in user through your server/API/whatever
    this.props.screenProps.isLoggedIn(); // sets state in parent component which will now update and render Home
    // set logged in status in AsyncStorage
  }
   closeModal = () => {
           this.setState({ modalVisible: false });
           this.setState({ tempPass: "" });
       };

  state = {
    fontLoaded: false,
    emailColor: "gray",
    passColor: "gray",
    modalVisible: false,
    email: "",
    pass: "",
  }
  async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
    }
    handleEmailEdit(value) {
      this.setState({
          email: value
      });
    }

    handlePassEdit(value) {
      this.setState({
          pass: value
      });
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
            <TextInput
                autoCapitalize={'none'}
                onChangeText={(value) => {this.handleEmailEdit(value)}}
                placeholder="Email Address"
                placeholderColor="#c4c3cb"
                style={[styles.loginFormTextInput, {fontSize: 16, fontFamily: 'Poor Story', borderColor: this.state.emailColor}]}
                ref={component => this._in1 = component}
                onEndEditing={() => {this._in2.focus();}}
                />
            <TextInput
                autoCapitalize={'none'}
                placeholder="Password"
                onChangeText={(value) => {this.handlePassEdit(value)}}
                placeholderColor="#c4c3cb"
                style={[styles.loginFormTextInput, {fontSize: 16, fontFamily: 'Poor Story', borderColor: this.state.passColor}]}
                secureTextEntry={true}
                ref={component => this._in2 = component}
            />
            <Button
              buttonStyle={styles.loginButton}
              onPress={() => {this.verifyUserData()}}
              title="Login"
              textStyle={{fontSize: 30, fontFamily: 'Poor Story'}}
            />
            <Button
                textStyle={{fontSize: 20, fontFamily: 'Poor Story'}}
                buttonStyle={styles.fbLoginButton}
                onPress={() => this.props.navigation.navigate('SignUp')}
                title="Sign Up"
                color="#3897f1"
              />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Modal
       animationType="fade"
       transparent={true}
       visible={this.state.modalVisible}
       onRequestClose={this.closeModal}
      >
       <View style={styles.modalContainer}>
         <Text style={styles.title}>
           {"Error!"}
         </Text>
         <Text style={styles.description}>
           {this.state.errorMessage}
         </Text>
         <Button
           color="#ABEBC6"
           onPress={this.closeModal}
           title="    OK    "
         />
       </View>
     </Modal>
      </KeyboardAvoidingView>
    )
    }
    else {
        return null
    }
  }
  //  Facebook Login
//            <Button
//              textStyle={{fontSize: 20, fontFamily: 'Poor Story'}}
//              buttonStyle={styles.fbLoginButton}
//              onPress={() => this.onFbLoginPress()}
//              title="Login with Facebook"
//              color="#3897f1"
//            />
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

const styles = StyleSheet.create({
  map: {
      ...StyleSheet.absoluteFillObject
    },
    bubble: {
      flex: 1,
      backgroundColor: "rgba(255,255,255,0.7)",
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20
    },
    latlng: {
      width: 200,
      alignItems: "stretch"
    },
    button: {
      width: 80,
      paddingHorizontal: 12,
      alignItems: "center",
      marginHorizontal: 10
    },
    buttonContainer: {
      flexDirection: "row",
      marginVertical: 20,
      backgroundColor: "transparent"
    },

    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    tabBarInfoContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      backgroundColor: '#fbfbfb',
      paddingVertical: 20,
    },
    tabBarInfoText: {
      fontSize: 17,
      color: 'rgba(96,100,109, 1)',
      textAlign: 'center',
    },
    navigationFilename: {
      marginTop: 5,
    },
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    marginTop: 150,
    marginBottom: 30,
    textAlign: 'center',
  },

  loginScreenLogo: {
    width: 162,
    height: 93,
    marginBottom: height*0.1,
  },

  loginScreenGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },

  loginFormView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    width: width*0.75,
  },
  loginButton: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  modalContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#DCDCDC",
      borderRadius: 4,
      borderColor: "#C0C0C0",
      borderWidth: 2,
      marginHorizontal: 60,
      marginVertical: 120
    },
  title: {
      padding: 20,
      fontSize: 25,
      textAlign: 'center',
      fontFamily: 'Poor Story'
    },
    description: {
      padding: 20,
      fontSize: 18,
      textAlign: 'center',
      fontFamily: 'Poor Story'
    }
});