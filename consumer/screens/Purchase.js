import React, { Component } from 'react'
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Button,
} from 'react-native'
import PropTypes from 'prop-types'
import { Font } from 'expo'

import { Colors } from '../constants'
const dateformat = require('dateformat');

import getDirections from 'react-native-google-maps-directions';
import fudlkr_locations from '../assets/static_data/fudlkr_locations.json';
import { SelectPayment } from 'react-native-checkout'
import * as firebase from 'firebase';

class Purchase extends Component {
    static navigationOptions = ({ navigation }) => {
       return {
         title: navigation.getParam('detail'),
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
     };
    state = {
        fontLoaded: false,
        paramsLoaded: false,
        modalVisible: false,
        paymentSource: '',
        meal_data: null,
        current_meal_data: null,
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });
    var temp = this.props.navigation.state.params;
    this.setState({ fontLoaded: true, paramsLoaded: true });
    this.populateInfo();
   }
   populateInfo() {
     //Get the current userID
     var userId = firebase.auth().currentUser.uid;
     //Get the user data
     return firebase.database().ref('/meals/all/').once('value').then(function(snapshot) {
         this.setState({ meal_data: snapshot.val().meals });
     }.bind(this));
   }
    _getLocationAsync = async () => {
          let { status } = await Permissions.askAsync(Permissions.LOCATION);
          if (status !== 'granted') {
            this.setState({
              errorMessage: 'Permission to access location was denied',
            });
          }

          let location = await Location.getCurrentPositionAsync({});

          var coords = this.regionFrom(location.coords.latitude, location.coords.longitude, 1000);
          this.setState({coords: coords});
          this.setState({your_lat: location.coords.latitude});
          this.setState({your_lng: location.coords.longitude});

        };

    readyPurchase = async () => {
        let meal_data = this.state.meal_data[this.props.navigation.state.params.idMeal-1];
        var date = new Date();
        var d = dateformat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
        meal_data.strDatePurchased = d.toString();
        meal_data.datePurchased = date.valueOf();
        meal_data.datePackaged = this.randomDate();
        meal_data.lockerCode = Math.round(Math.random() * (9999 - 1000) + 1000);
        meal_data.pickedUp = false;
        meal_data.datePickedUp = "N/A";
        await firebase.database().ref('/meals/mealCounter').once('value').then(function(snapshot) {
            meal_data.idOrder = snapshot.val();
        }.bind(this));
        var userId = firebase.auth().currentUser.uid;
        await firebase.database().ref('/meals').update({
          mealCounter: meal_data.idOrder + 1
        });
        meal_data.strIdOrder = "Order #" + meal_data.idOrder.toString();
        meal_data.paymentMethod = {};
        meal_data.paymentMethod.brand = "Visa";
        meal_data.paymentMethod.expiry = "02/22";
        meal_data.paymentMethod.last4 = "0789";
        this.setState({meal_data: meal_data});
    }

    purchaseMeal = async () => {
        //Get the current userID
        var userId = firebase.auth().currentUser.uid;
        await firebase.database().ref('users/' + userId + '/orders/current/').push(this.state.meal_data);
        await firebase.database().ref('users/' + userId + '/orders/history/').push(this.state.meal_data);
    }

        regionFrom(lat, lon, distance) {
                distance = distance/2
                const circumference = 40075
                const oneDegreeOfLatitudeInMeters = 111.32 * 1000
                const angularDistance = distance/circumference

                const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
                const longitudeDelta = Math.abs(Math.atan2(
                        Math.sin(angularDistance)*Math.cos(lat),
                        Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)))

                return result = {
                    latitude: lat,
                    longitude: lon,
                    latitudeDelta,
                    longitudeDelta,
                }
            };

          handleGetDirections () {
                var arrayLength = fudlkr_locations.data.length;
                   for (var i = 0; i < arrayLength; i++) {
                      if( fudlkr_locations.data[i].strArea == this.props.navigation.state.params.location) {
                          latitude = fudlkr_locations.data[i].latlng.latitude;
                          longitude = fudlkr_locations.data[i].latlng.longitude;
                      }
                   }
                  const data = {
                    source: {
                     latitude: this.state.your_lat,
                     longitude: this.state.your_lng
               },
                   destination: {
                     latitude: latitude,
                     longitude: longitude
               },
                   params: [
                     {
                       key: "travelmode",
                       value: "walking"        // may be "walking", "bicycling" or "transit" as well
                 },
                 {
                       key: "dir_action",
                       value: "travelmode"       // this instantly initializes navigation using the given travel mode
                 }
               ]
              }

                  getDirections(data)
          }
  renderDetail = () => {
    return (
      <View>
        <Text style={styles.subDetailText}>{this.props.navigation.state.params.detail}</Text>
      </View>
    )
  }
  randomDate() {
      var date = new Date();
      days_past = Math.random() * (5 - 0) + 0;
      date.setDate(date.getDate()-days_past);
      var d = dateformat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
      return d.toString()
  }

  renderDescription = () => {
    if (this.props.navigation.state.params.cost==0){
        return null
    }
    return (
    <View>
        <View>
            <Text style={styles.detailText}>{this.props.navigation.state.params.title}</Text>
            <Text style={styles.descriptionText}>Location: {this.props.navigation.state.params.location}</Text>
          </View>
    </View>

    )
  }

  renderNavigator = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly'
        }}
      >
        <TouchableOpacity style={[styles.navigatorButton, { flex: 2 }]}
            onPress={() => {this.handleGetDirections()
        }}>
          <Text style={styles.descriptionText}>DIRECTIONS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navigatorButton, { flex: 2 }]}
            onPress={() => {
                 var arrayLength = fudlkr_locations.data.length;
                 for (var i = 0; i < arrayLength; i++) {
                    if( fudlkr_locations.data[i].type == this.props.navigation.state.params.location) {
                        latitude = fudlkr_locations.data[i].latlng.latitude;
                        longitude = fudlkr_locations.data[i].latlng.longitude;
                    }
                 }

                 this.props.navigation.navigate('Home', {coords: {latitude: latitude, longitude: longitude}, searching: false});
                }}>
          <Text style={styles.descriptionText}>MAP</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderContactHeader = () => {
    const img  = this.props.navigation.state.params.img;
    return (
      <View style={styles.headerContainer}>
        <View style={styles.coverContainer}>
          <ImageBackground
            source={{
              uri: img,
            }}
            style={styles.coverImage}
          >
          </ImageBackground>
        </View>
      </View>
    )
  }

  closeModal = () => {
     this.setState({ modalVisible: false });
 };

  render() {
    let params = this.props.navigation.state.params;
    if (this.props.navigation.state.params.cost==0 || this.state.meal_data == null){
            return null
          }
    return (
      <View style={styles.mainviewStyle}>
        { params && this.state.fontLoaded ?
        <View style={styles.mainviewStyle}>
          <View style={[styles.container, this.props.containerStyle]}>
              <View style={styles.cardContainer}>
                  {this.renderContactHeader()}
              </View>
              <View style={styles.productRow}>
                    {this.renderDescription()}
                </View>
              <View style={styles.paymentMethodContainer}>
                  {<Text style={[styles.detailText,{color: 'black'}]}>Select a Payment Method to Continue</Text>}
              </View>
                <SelectPayment
                  enableApplePay={true} // optional, default: false
                  applePayHandler={() => {this.setState({modalVisible: true});this.setState({paymentSource: 'Apple Pay'})}} // optional
                  paymentSources={[
                    {last4: '1234', brand: 'American Express', more: 'stuff' },
                    {last4: '2345', brand: 'Visa', more: 'stuff' },
                  ]} // mandatory, See: [Customer Object](https://stripe.com/docs/api/node#customer_object) -> sources -> data for Stripe format.
                  addCardHandler={() => {this.props.navigation.navigate("AddPurchaseCard");}}
                  selectPaymentHandler={(paymentSource) => {this.setState({modalVisible: true});this.setState({paymentSource: paymentSource});this.readyPurchase();}}
                  styles={{addButton: {marginTop: 0, marginBottom: 0},
                    addButtonText: {fontFamily: 'Poor Story', fontWeight: 'normal', fontSize: 22},
                    paymentMethodsInnerContainer: { borderTopWidth: 0, borderBottomWidth: 0},
                    cardTextLast4: {fontFamily: 'Poor Story', fontWeight: 'normal', fontSize: 22, color: 'green'},
                    cardTextEndingIn: {fontFamily: 'Poor Story', fontWeight: 'normal', fontSize: 18},
                    cardTextType: {fontFamily: 'Poor Story', fontWeight: 'normal', fontSize: 22, color: 'green'}}}
                />
          </View>
        <Modal
         animationType="fade"
         transparent={true}
         visible={this.state.modalVisible}
         onRequestClose={this.closeModal}
        >
         <View style={styles.modalContainer}>
           <Text style={styles.title}>
             {"Confirm this transaction!"}
           </Text>
           <Text style={styles.description}>
             {"You will be able to pickup your " + this.props.navigation.state.params.title + " in " + this.props.navigation.state.params.location + " for the next 4 hours. \n\nYou've chosen to use your " + this.state.paymentSource["brand"] + " to pay for this transaction\n\n"}
           </Text>
           <Button
             color="#ABEBC6"
             onPress={() => {
                this.closeModal();
                this.purchaseMeal();
                this.props.navigation.navigate('Order', {
                    'title': this.state.meal_data.strMeal,
                    'img': this.state.meal_data.strMealThumb,
                    'cost': this.state.meal_data.strCost,
                    'calories':this.state.meal_data.calories,
                    'strCategory': this.state.meal_data.strCategory,
                    'location': this.state.meal_data.location,
                    'paymentMethod': {"brand": "Visa", "expiry": "02/22", "cvc": "300", "last4": "1234"},
                    'lockerCode': this.state.meal_data.lockerCode,
                    'strIdOrder': this.state.meal_data.strIdOrder,
                    'idOrder': this.state.meal_data.idOrder});}}
             title={"  Pay $" + this.props.navigation.state.params.cost + "  "}
           />
         </View>
       </Modal>
        </View>
        : null }
      </View>
    )
  }
}

export default Purchase;

const styles = StyleSheet.create({
cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly'
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
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    height: Dimensions.get('window').width * (3 / 4),
    width: Dimensions.get('window').width,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  scroll: {
    backgroundColor: '#FFF',
    flex: 1,
    marginBottom: 55,
  },
  productRow: {
    marginTop: 75,
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#2ECC71',
    justifyContent: 'space-between',
    flexDirection: 'column',
    margin: 10,
    padding: 20,
    paddingBottom: 10,
    alignSelf: 'center'
  },
  paymentMethodContainer: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignSelf: 'center'
  },
  mainviewStyle: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  coverMetaContainer: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
    // marginBottom: 15,
    // marginRight: 15,
  },
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2ECC71',
    flexDirection: 'row',
    height: 65,
    alignItems: 'center',
  },
  buttonFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navigatorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  borderCenter: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#FFA890',
  },
  textFooter: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
    fontFamily: 'Poor Story',
  },
  priceText: {
    marginBottom: 5,
    letterSpacing: 1,
    color: Colors.black,
    fontSize: 36,
    fontWeight: '400',
    fontFamily: 'Poor Story',
  },
  buttonText: {
      marginBottom: 5,
      letterSpacing: 1,
      color: 'white',
      fontSize: 36,
      fontWeight: '400',
      fontFamily: 'Poor Story',
    },
  detailText: {
    marginBottom: 4,
    color: 'white',
    fontSize: 22,
    letterSpacing: 0.5,
    fontFamily: 'Poor Story',
  },
  subDetailText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '100',
    lineHeight: 28,
    letterSpacing: 0.5,
    fontFamily: 'Poor Story',
  },
  descriptionText: {
    marginBottom: 4,
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1,
    fontFamily: 'Poor Story',
    alignSelf: 'center'
  },title: {
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
