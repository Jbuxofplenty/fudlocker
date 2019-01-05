import React, { Component } from "react";
import { LinearGradient, Font } from 'expo';
import { NavigationActions } from 'react-navigation';

import {Keyboard, Text, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView, Modal, Dimensions, StyleSheet} from 'react-native';
import { Button } from 'react-native-elements';
import {Image} from 'react-native' ;
import * as firebase from 'firebase';
import * as EmailValidator from 'email-validator';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC6wZSSUcyYDpsuS6bTxfrnOjrY1KIi1qU",
    authDomain: "fudlkr-7fc5b.firebaseapp.com",
    databaseURL: "https://fudlkr-7fc5b.firebaseio.com",
    projectId: "fudlkr-7fc5b",
    storageBucket: "fudlkr-7fc5b.appspot.com",
    messagingSenderId: "471202846868"
  };
const firebaseApp = firebase.initializeApp(firebaseConfig);

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

export default class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.itemsRef = firebaseApp.database().ref();
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
    if(this.state.passConfirm == this.state.pass) {
        this.setState({ passConfirmColor: 'green' });
    }
    else {
        validated = false;
        this.setState({ passConfirmColor: 'red' });
        this.setState({ errorMessage: 'Passwords do not match!'});
        this.setState({ modalVisible: true });
        return validated;
    }
    return validated;
  }

  signUpUser() {
      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass).then((authData) => {
           firebaseApp.database().ref("users/" + authData.user.uid).set({
                  email: this.state.email,
                  name: "",
                  phone: "",
                  mealRadius: 20
                });
                 this.logInUser();
       }).catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          this.setState({errorMessage: errorMessage});
          this.setState({modalVisible: true});
    }.bind(this));
  }
  componentWillUnmount() {
      this.state._isMounted  = false;
    }
  logInUser() {
    // logic to log in user through your server/API/whatever
    this.props.screenProps.isLoggedIn(); // sets state in parent component which will now update and render Home
  }

  state = {
    fontLoaded: false,
    errorMessage: "",
    modalVisible: false,
    email: "",
    pass: "",
    passConfirm: "",
    login: true,
    _isMounted: true,
    emailColor: "gray",
    passColor: "gray",
    passConfirmColor: "gray",
  };
  
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
  handlePassConfirm(value) {
    this.setState({
        passConfirm: value
    });
  }
  
  async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });
    this.setState({ fontLoaded: true });
    this._isMounted = true;
    }

  closeModal = () => {
         this.setState({ modalVisible: false });
         this.setState({ tempPass: "" });
     };

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
                    placeholder="Email Address"
                    onChangeText={(value) => {this.handleEmailEdit(value)}}
                    placeholderColor="#c4c3cb" style={[styles.loginFormTextInput, {fontSize: 16, fontFamily: 'Poor Story', borderColor: this.state.emailColor}]}
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
                    onEndEditing={() => {this._in3.focus();}}
                />
                <TextInput autoCapitalize={'none'}
                    placeholder="Confirm Password"
                    onChangeText={(value) => {this.handlePassConfirm(value)}}
                    placeholderColor="#c4c3cb"
                    style={[styles.loginFormTextInput, {fontSize: 16, fontFamily: 'Poor Story', borderColor: this.state.passConfirmColor}]}
                    secureTextEntry={true}
                    ref={component => this._in3 = component}
                />
                <Button
                  buttonStyle={styles.signUpButton}
                  onPress={(text) => {if(this.verifyUserData()) {this.signUpUser()}  }}
                  title="Sign Up!"
                  textStyle={{fontSize: 30, fontFamily: 'Poor Story'}}
                />
                <Button
                  textStyle={{fontSize: 20, fontFamily: 'Poor Story'}}
                  buttonStyle={styles.loginButton}
                  onPress={() => this.props.navigation.navigate('Login')}
                  title="Login"
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
  signUpButton: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
  },
  loginButton: {
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