import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Linking,
	Image,
	ActivityIndicator,
	Dimensions,
	TouchableHighlight,
	ImageBackground,
	ScrollView,
	} from 'react-native';

import GridView from 'react-native-super-grid';
import { LinearGradient, Font } from 'expo';
import { NavigationActions } from 'react-navigation';
const dateformat = require('dateformat');
import * as firebase from 'firebase';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class CurrentOrders extends Component {
    static navigationOptions = ({ navigation }) => {
       return {
         title: navigation.getParam('title'),
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
    randomDate(low, high) {
          var date = new Date();
          days_past = Math.random() * (high - low) + low;
          date.setDate(date.getDate()-days_past);
          var d = dateformat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
          return d.toString()
    };

    state = {
        fontLoaded: false,
        order_data: null,
    };

    async componentDidMount() {
      await Font.loadAsync({
          'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
        });

      this.setState({ fontLoaded: true });
      this.populateInfo();
    }

    async scrubCurrent() {
       //Get the current userID
       var userId = firebase.auth().currentUser.uid;
       //Get the user data
       var oldest = new Date();
       oldest = oldest.valueOf()-(1000*60*5);
       if(this.props.navigation.state.params.order_type == "Current") {
            await firebase.database().ref('/users/' + userId + '/orders/current/').once('value', function(snapshot) {
            let tempArray = [];
            snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
              if(oldest < childData.datePurchased) {
                tempArray.push(childData);
              }
              else {
                firebase.database().ref('/users/' + userId + '/orders/current/' + childSnapshot.key).remove();
              }
            });
            this.setState({ order_data: tempArray });
          }.bind(this));
       }
       else {
            await firebase.database().ref('/users/' + userId + '/orders/history/').once('value', function(snapshot) {
            let tempArray = [];
            snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
              if(oldest >= childData.datePurchased) {
                var date = new Date();
                var d = dateformat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
                firebase.database().ref('/users/' + userId + '/orders/history/' + childSnapshot.key).update( {
                    pickedUp: true,
                    datePickedUp: d.toString(),
                });
              }
              tempArray.push(childData);
            });
            this.setState({ order_data: tempArray });
          }.bind(this));
       }
     }

    async populateInfo() {
       //Get the current userID
       var userId = firebase.auth().currentUser.uid;
       //Get the user data
       if(this.props.navigation.state.params.order_type == "Current") {
           await firebase.database().ref('/users/' + userId + '/orders/current/').once('value', function(snapshot) {
            let tempArray = [];
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.forEach(function(childChildSnapshot) {
                  var childData = childChildSnapshot.val();
                  tempArray.push(childData);
              })
            });
            this.setState({ order_data: tempArray });
          }.bind(this));
       }
       else {
            await firebase.database().ref('/users/' + userId + '/orders/history/').once('value', function(snapshot) {
            let tempArray = [];
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.forEach(function(childChildSnapshot) {
                    var childData = childChildSnapshot.val();
                    tempArray.push(childData);
                })
            });
            this.setState({ order_data: tempArray });
          }.bind(this));
       }
    }
  render() {
    if(this.state.order_data != null ) {
        return (
        <View style={styles.mealsScreenContainer}>
          <LinearGradient
              colors={['#ABEBC6', '#2ECC71']}
              style={styles.mealsScreenGradient}
            />
          <GridView
            itemDimension={140}
            style={styles.gridView}
            items={this.state.order_data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
                <TouchableHighlight style={{borderRadius: 25}} onPress={() => {
                        this.props.navigation.navigate('Order', {'title': item.title,
                                                                 'img': item.strMealThumb,
                                                                 'cost': item.strCost,
                                                                 'calories': item.calories,
                                                                 'strCategory': item.strCategory,
                                                                 'location': item.location,
                                                                 'paymentMethod': item.paymentMethod,
                                                                 'strIdMeal': item.strIdMeal,
                                                                 'strIdOrder': "Order #" + item.idMeal,
                                                                 'datePackaged': item.strDatePackaged,
                                                                 'datePurchased': item.strDatePurchased,
                                                                 'pickedUp': item.pickedUp,
                                                                 'idMeal': item.idMeal});
                    }}>
                  <View style={[styles.itemContainer]}>
                    <Text style={{fontFamily: 'Poor Story', textAlign: 'center', width: '100%', fontSize: 28, color: '#fff', backgroundColor: item.code, borderRadius:25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>{item.idMeal}</Text>
                        <View style={{height: 175}}>
                            <Text style={styles.infoText}>{item.strMeal}</Text>
                            <View style={styles.lineItemContainer} >
                                <Text style={styles.labelText}>Meal ID #:</Text>
                                <Text style={styles.valueText}>{item.idMeal}</Text>
                            </View>
                            <View style={styles.lineItemContainer} >
                                <Text style={styles.labelText}>Date Purchased:</Text>
                                <Text style={styles.valueText}>{item.strDatePurchased}</Text>
                            </View>
                            <View style={styles.lineItemContainer} >
                                {item.paymentMethod["brand"] == 'Visa' &&
                                    <Image
                                        style={{width: 50, height: 25, margin: 15, borderRadius: 3}}
                                        source={require("./../assets/images/visa.png")}
                                     />
                                }
                                {item.paymentMethod["brand"] == 'American Express' &&
                                   <Image
                                       style={{width: 50, height: 25, margin: 15, borderRadius: 3}}
                                       source={require("./../assets/images/amex.png")}
                                    />
                                }
                                <Text style={styles.valueText}>{"Ending in " + item.paymentMethod["last4"]}</Text>
                            </View>
                        </View>
                  </View>
              </TouchableHighlight>
            )}
          />
          </View>
        );
    }
    else {
        return null
    }
  }
}
const styles = StyleSheet.create({
    mealsScreenContainer: {
      flex: 1,
    },
    mealsScreenGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: height,
    },
    gridView: {
      paddingTop: 25,
      flex: 1,
    },
    img: {
      width: 30,
      height: 30,
    },
    itemContainer: {
      flexDirection: 'column',
      flex: 1,
      borderRadius: 25,
      paddingBottom: 0,
      height: 210,
      backgroundColor: 'white'
    },
    lineItemContainer : {
        flex: 1,
        flexDirection: 'row',
    },
    infoText: {
      paddingTop: 10,
      fontFamily: 'Poor Story',
      fontSize: 16,
      color: 'black',
      alignSelf: 'center'
    },
    labelText: {
      fontFamily: 'Poor Story',
      fontSize: 12,
      color: 'black',
      width: '50%',
      textAlignVertical: 'center',
      textAlign: 'left',
      paddingLeft: 5,
    },
    valueText: {
      fontFamily: 'Poor Story',
      fontSize: 12,
      width: '50%',
      color: 'black',
      textAlignVertical: 'center',
      textAlign: 'right',
      paddingRight: 5,
    },
    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },
});
