const React = require("react-native");

const { StyleSheet } = React;
import { AppRegistry, Text, View,Dimensions } from 'react-native';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;


export default {

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
};
