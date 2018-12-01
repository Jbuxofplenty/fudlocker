import React, { Component } from 'react'
import { ScrollView, Keyboard, Switch, Button, StyleSheet, Text, View, Share, WebView, Linking, TouchableOpacity, Image, Dimensions, Modal, TextInput, Platform } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Font } from 'expo'
import Rate, { AndroidMarket } from 'react-native-rate'
import ToggleSwitch from 'toggle-switch-react-native'
import BaseIcon from './Icon'
import Chevron from './Chevron'
import InfoText from './InfoText'
import FontText from '../FontText'
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input"

class AddNewCard extends Component {
  static navigationOptions = {
        title: 'Add Credit Card',
        headerStyle: {
          backgroundColor: '#2ECC71',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          textAlign: 'center',
          alignSelf: 'center',
          flex: 1,
        },
    };
  state = {
    pushNotifications: true,
    fontLoaded: false,
    mealRadius: 1.5,
    showCardEdit: true,
    modalVisible: false,
    values: { number: "4242 4242 4242 4242", expiry: "02/22", cvc: "300", name: "Josiah Buxton", type: "visa" },
  }

  toggleCardEdit() {
      this.setState({
          showCardEdit: !this.state.showCardEdit
      });
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
    }

   closeModal = () => {
       this.setState({ modalVisible: false });
       this.setState({ tempPass: "" });
   };

  render() {
    if ( this.state.fontLoaded ){
       return (
          <View style={{flex: 1, flexDirection: 'column' }}>
                <CreditCardInput onChange={this._onChange} />
                <View style={{alignSelf: 'center', width: '50%', marginTop: 20}}>
                    <Button
                     color="#ABEBC6"
                     onPress={() => {this.props.navigation.navigate('PaymentInfo')}}
                     title="    SAVE    "
                   />
               </View>
          </View>
       )
    } else {
        return null
    }
  }
}

export default AddNewCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center'
  },
  scrollContainer: {
      flexGrow: 1,
      backgroundColor: '#fff',
      flexDirection: 'column',
      alignItems: 'center',
    },
  avatar: {
    width: '50%',
    height: Dimensions.get('window').width/2,
    margin: 10,
  },
  labelContainer: {
      backgroundColor: '#F9F9F9',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
  nameContainer: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 0,
    margin: 10,
    padding: 20,
    paddingBottom: 10
  },
  nameSubContainer: {
      width: '100%',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
  edit: {
      fontFamily: 'Poor Story',
      color: 'blue',
      fontSize: 15,
      textAlignVertical: 'center',
      textAlign: 'right',
    },
  editContainer: {
    width: '20%',
    backgroundColor: '#FFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 5,
  },
  separatorContainer: {
    width: '5%',
    backgroundColor: '#FFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 5,
  },
  nameInput: {
      fontFamily: 'Poor Story',
      fontSize: 35,
      textAlign: 'center',
      textAlignVertical: 'center',
      backgroundColor: '#FFF',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 3,
      width: '80%',
    },
  emailInput: {
    fontFamily: 'Poor Story',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 3,
    width: '80%',
  },
  name: {
    fontFamily: 'Poor Story',
    fontSize: 20,
    textAlignVertical: 'center'
  },
  email: {
    fontFamily: 'Poor Story',
    fontSize: 20,
    textAlignVertical: 'center'
  },
  phone: {
    fontFamily: 'Poor Story',
    fontSize: 20,
    textAlignVertical: 'center'
  },
  label: {
    fontFamily: 'Poor Story',
    textAlignVertical: 'center',
    fontSize: 16,
    marginHorizontal: 10,
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
