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
import { SelectPayment } from 'react-native-checkout'

// json data, will be converted to DB
import asian_data from '../assets/dynamic_data/meals_asian.json';
import mexican_data from '../assets/dynamic_data/meals_mexican.json';
import american_data from '../assets/dynamic_data/meals_american.json';
import salad_data from '../assets/dynamic_data/meals_salads.json';
import apps_data from '../assets/dynamic_data/meals_apps.json';
import italian_data from '../assets/dynamic_data/meals_italian.json';
import meat_data from '../assets/dynamic_data/meals_meat.json';

import farrand_data from '../assets/dynamic_data/meals_farrand.json';
import c4c_data from '../assets/dynamic_data/meals_c4c.json';
import village_data from '../assets/dynamic_data/meals_village.json';

import current_data from '../assets/dynamic_data/orders_current.json';
import history_data from '../assets/dynamic_data/order_history.json';
import all_data from '../assets/dynamic_data/all_meals.json';


const meal_data = {
    'Asian': asian_data.meals,
    'Mexican': mexican_data.meals,
    'American': american_data.meals,
    'Salads': salad_data.meals,
    'Appetizers': apps_data.meals,
    'Italian': italian_data.meals,
    'Meat': meat_data.meals,
    'Farrand': farrand_data.meals,
    'C4C': c4c_data.meals,
    'Village': village_data.meals,
    'Current': current_data.orders,
    'History': history_data.orders,
    'All': all_data.meals,
}

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
      }
render() {
    return (
    <View style={styles.mealsScreenContainer}>
      <LinearGradient
          colors={['#ABEBC6', '#2ECC71']}
          style={styles.mealsScreenGradient}
        />
      <GridView
        itemDimension={140}
        style={styles.gridView}
        items={meal_data[this.props.navigation.state.params.meal_type]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (

            <TouchableHighlight style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} onPress={() => {
                    title = item.strMeal;
                    img = item.strMealThumb;
                    location = item.location;
                    strCategory = item.strCategory;
                    cost = item.strCost;
                    calories = item.calories;
                    desc = item.desc;
                    paymentMethod = item.paymentMethod;
                    lockerCode = item.lockerCode;
                    idOrder = item.idOrder;
                    strIdOrder = item.strIdOrder;
                    this.props.navigation.navigate('Order', {'title': title, 'img': img, 'detail': desc, 'cost': cost, 'calories':calories, 'strCategory': strCategory, 'location': location, 'paymentMethod': paymentMethod, 'lockerCode': lockerCode, 'strIdOrder': strIdOrder, 'idOrder': idOrder});
                }}>
              <View style={[styles.itemContainer]}>
                <Text style={{fontFamily: 'Poor Story', textAlign: 'center', width: '100%', fontSize: 28, color: '#fff', backgroundColor: item.code, borderRadius:25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>{item.strIdOrder}</Text>
                    <View style={{height: 175}}>
                        <Text style={styles.infoText}>{item.strMeal}</Text>
                        <View style={styles.lineItemContainer} >
                            <Text style={styles.labelText}>4 Digit Code:</Text>
                            <Text style={styles.valueText}>{item.lockerCode}</Text>
                        </View>
                        <View style={styles.lineItemContainer} >
                            <Text style={styles.labelText}>Date Purchased:</Text>
                            <Text style={styles.valueText}>{this.randomDate(0,5)}</Text>
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
      height: 200,
      backgroundColor: 'white'
    },
    lineItemContainer : {
        flex: 1,
        flexDirection: 'row',
    },
    infoText: {
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
