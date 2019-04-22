import React, { Component } from 'react'
import { ScrollView, Keyboard, StyleSheet, Text, View, WebView, Linking, TouchableOpacity, Image, Dimensions, Modal, TextInput, Platform } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Font } from 'expo'
import Rate, { AndroidMarket } from 'react-native-rate'
import ToggleSwitch from 'toggle-switch-react-native'
import * as firebase from 'firebase';
import { PaymentCardTextField } from 'tipsi-stripe'

import BaseIcon from './Icon'
import Chevron from './Chevron'
import InfoText from './InfoText'
import FontText from '../FontText'

class PaymentInfo extends Component {
  static navigationOptions = {
        title: 'Payment Information',
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
    pEvents: 'none',
    values: { number: "4242 4242 4242 4242", expiry: "02/22", cvc: "300", name: "Josiah Buxton", type: "visa" },
    showAddressEdit: true,
    name: null,
    address1: null,
    address2: null,
    state: null,
    city: null,
    zip: null,
    country: null,
    tempName: "",
    tempAddress1: "",
    tempAddress2: "",
    tempState: "",
    tempZip: "",
    tempCountry: "",
  }

  toggleCardEdit() {
      this.setState({
          showCardEdit: !this.state.showCardEdit
      });
  }
  toggleAddressEdit() {
    this.setState({
        showAddressEdit: !this.state.showAddressEdit
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
//        if(this.state.showCardEdit){
//            this._CCInput.setValues(this.state.values);
//            Keyboard.dismiss();
//        }
//        else {
//            this._CCInputEdit.setValues(this.state.values);
//            Keyboard.dismiss();
//        }
        this.populateInfo();
    }

      populateInfo() {
        //Get the current userID
        var userId = firebase.auth().currentUser.uid;
        //Get the user data
        return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            this.setState({ name: snapshot.val().name });
            this.setState({ address1: "" });
            this.setState({ address2: "" });
            this.setState({ city: "" });
            this.setState({ state: "" });
            this.setState({ tempPhone: snapshot.val().phone });
        }.bind(this));
      }

    updateData = () => {
      //Get the current userID
      var userId = firebase.auth().currentUser.uid;
      firebase.database().ref('users/' + userId).update({
        name: this.state.name,
        email: this.state.email,
        phone : this.state.phone
      });
   }

   closeModal = () => {
       this.setState({ modalVisible: false });
       this.setState({ tempPass: "" });
   };

  render() {
    if ( this.state.fontLoaded && this.state.name != null ){
        if ( this.state.showCardEdit && this.state.showAddressEdit ) {
            return (
              <View style={styles.container}>
                <View style={styles.nameContainer}>
                    <View style={styles.nameSubContainer}>
                        <Text style={styles.category}>
                            Credit Cards
                        </Text>
                        <View style={styles.labelContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Primary Credit Card
                                </Text>
                                <Text style={styles.label}>
                                    Expiry Date
                                </Text>
                                <Text style={styles.label}>
                                    CVC Code
                                </Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                            <TouchableOpacity style={styles.editContainer} onPress={() => {}}>
                               <Text style={styles.edit}>add </Text>
                            </TouchableOpacity>
                            <View style={styles.separatorContainer}>
                                   <Text style={styles.edit}>|</Text>
                               </View>
                            <TouchableOpacity style={styles.editContainer} onPress={() => {}}>
                                <Text style={styles.edit}>edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <View style={styles.nameSubContainer}>
                        <Text style={styles.category}>
                            Billing Address
                        </Text>
                        <View style={styles.labelContainer}>
                            <View style={[styles.labelContainer, {marginVertical: 10}]}>
                                <Text style={styles.label}>
                                    Name:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.name}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Address:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.address1}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Address 2:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.address2}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    City:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.city}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    State:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.state}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Zip Code:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.zip}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Country:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.country}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                            <TouchableOpacity style={styles.editContainer} onPress={() => {this.toggleAddressEdit();}}>
                                <Text style={styles.edit}>edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
              </View>
            )}
        if ( !this.state.showCardEdit ){
            return (
              <View style={styles.container}>
                <View style={styles.nameContainer}>
                    <View style={styles.nameSubContainer}>
                        <View style={styles.labelContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Primary Credit Card
                                </Text>
                                <Text style={styles.label}>
                                    Expiry Date
                                </Text>
                                <Text style={styles.label}>
                                    CVC Code
                                </Text>
                            </View>
                        </View>
                        <View ref={component => this._CCInputViewEdit = component} pointerEvents={this.state.pEvents}>
                        </View>
                        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                            <TouchableOpacity style={styles.editContainer} onPress={() => {Keyboard.dismiss();this.setState({pEvents: 'none'}); this.toggleCardEdit();}}>
                               <Text style={styles.edit}>cancel </Text>
                            </TouchableOpacity>
                            <View style={styles.separatorContainer}>
                                   <Text style={styles.edit}>|</Text>
                               </View>
                            <TouchableOpacity style={styles.editContainer} onPress={() => {Keyboard.dismiss();this.setState({pEvents: 'none'});this.toggleCardEdit();}}>
                                <Text style={styles.edit}>save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <View style={styles.nameSubContainer}>
                        <Text style={styles.category}>
                            Billing Address
                        </Text>
                        <View style={styles.labelContainer}>
                            <View style={[styles.labelContainer, {marginVertical: 10}]}>
                                <Text style={styles.label}>
                                    Name:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.name}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Address:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.address1}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Address 2:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.address2}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    City:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.city}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    State:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.state}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Zip Code:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.zip}
                            </Text>
                        </View>
                        <View style={[styles.labelContainer, {marginVertical: 10}]}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Country:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.country}
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                            <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({pEvents: 'auto'}); this.toggleAddressEdit();}}>
                                <Text style={styles.edit}>edit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
              </View>
            )}
            if ( !this.state.showAddressEdit ) {
                return (
                  <View style={styles.container}>
                    <View style={styles.nameContainer}>
                        <View style={styles.nameSubContainer}>
                            <Text style={styles.category}>
                                Credit Cards
                            </Text>
                            <View style={styles.labelContainer}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>
                                        Primary Credit Card
                                    </Text>
                                    <Text style={styles.label}>
                                        Expiry Date
                                    </Text>
                                    <Text style={styles.label}>
                                        CVC Code
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                                <TouchableOpacity style={styles.editContainer} onPress={() => {}}>
                                   <Text style={styles.edit}>add </Text>
                                </TouchableOpacity>
                                <View style={styles.separatorContainer}>
                                       <Text style={styles.edit}>|</Text>
                                   </View>
                                <TouchableOpacity style={styles.editContainer} onPress={() => {}}>
                                    <Text style={styles.edit}>edit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={styles.nameContainer}>
                        <View style={styles.nameSubContainer}>
                            <Text style={styles.category}>
                                Billing Address
                            </Text>
                            <View style={styles.labelContainer}>
                                <View style={[styles.labelContainer, {marginVertical: 10}]}>
                                    <Text style={styles.label}>
                                        Name:
                                    </Text>
                                </View>
                                <TextInput
                                    style={styles.nameInput}
                                    ref={component => this._in1 = component}
                                    onEndEditing={() => {this._in2.focus();}}
                                >
                                {this.state.name}
                                </TextInput>
                            </View>
                            <View style={[styles.labelContainer, {marginVertical: 10}]}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>
                                        Address:
                                    </Text>
                                </View>
                                <TextInput
                                    style={styles.nameInput}
                                    ref={component => this._in2 = component}
                                    onEndEditing={() => {this._in3.focus();}}
                                >
                                {this.state.address1}
                                </TextInput>
                            </View>
                            <View style={[styles.labelContainer, {marginVertical: 10}]}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>
                                        Address 2:
                                    </Text>
                                </View>
                                <TextInput
                                    style={styles.nameInput}
                                    ref={component => this._in3 = component}
                                    onEndEditing={() => {this._in4.focus();}}
                                >
                                {this.state.address2}
                                </TextInput>
                            </View>
                            <View style={[styles.labelContainer, {marginVertical: 10}]}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>
                                        State:
                                    </Text>
                                </View>
                                <TextInput
                                    style={styles.nameInput}
                                    ref={component => this._in4 = component}
                                    onEndEditing={() => {this._in5.focus();}}
                                >
                                {this.state.state}
                                </TextInput>
                            </View>
                            <View style={[styles.labelContainer, {marginVertical: 10}]}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>
                                        Zip Code:
                                    </Text>
                                </View>
                                <TextInput
                                    style={styles.nameInput}
                                    ref={component => this._in5 = component}
                                    onEndEditing={() => {this._in6.focus();}}
                                    >
                                {this.state.zip}
                                </TextInput>
                            </View>
                            <View style={[styles.labelContainer, {marginVertical: 10}]}>
                                <View style={styles.labelContainer}>
                                    <Text style={styles.label}>
                                        Country:
                                    </Text>
                                </View>
                                <TextInput
                                    style={styles.nameInput}
                                    ref={component => this._in6 = component}
                                    onEndEditing={() => {Keyboard.dismiss();}}
                                >
                                {this.state.country}
                                </TextInput>
                            </View>
                            <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                                <TouchableOpacity style={styles.editContainer} onPress={() => {
                                        Keyboard.dismiss();
                                        this.toggleAddressEdit();
                                        }}>
                                   <Text style={styles.edit}>cancel </Text>
                                </TouchableOpacity>
                                <View style={styles.separatorContainer}>
                                       <Text style={styles.edit}>|</Text>
                                   </View>
                                <TouchableOpacity style={styles.editContainer} onPress={() => {
                                        Keyboard.dismiss();
                                        this.toggleAddressEdit();
                                        }}>
                                    <Text style={styles.edit}>save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                  </View>
        )}
    } else {
        return null
    }
  }
}

export default PaymentInfo;

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
  category: {
    fontFamily: 'Poor Story',
    fontSize: 24,
    textAlignVertical: 'center',
    alignSelf: 'center',
    marginBottom: 10,
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
    },
    phone: {
        fontFamily: 'Poor Story',
        fontSize: 20,
        textAlignVertical: 'center'
    },
  field: {
    width: 300,
    color: '#449aeb',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
});
