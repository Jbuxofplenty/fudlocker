import React, { Component } from 'react'
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'
import { Font } from 'expo'

import { Colors } from '../constants'
const dateformat = require('dateformat');
import * as firebase from 'firebase';
import ParallaxScrollView from 'react-native-parallax-scrollview';
import Carousel, {ParallaxImage, Pagination} from 'react-native-snap-carousel';
import Chevron from './settings/Chevron';
import ChevronLeft from './settings/ChevronLeft';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

function wp (percentage) {
    const value = (percentage * SCREEN_WIDTH) / 100;
    return Math.round(value);
}

const slideHeight = SCREEN_HEIGHT * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = SCREEN_WIDTH;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

class ActiveMeals extends Component {
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
    state = {
        fontLoaded: false,
        paramsLoaded: false,
        activeInventory: null,
        location: null,
        title: null,
        claimedInventory: null,
        activeSlide: 0,
        pickedUpMeals: null,
        pickedUp: null,
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });
    var temp = this.props.navigation.state.params;
    this.setState({ fontLoaded: true, paramsLoaded: true });
    this.populateInfo();
   }

   async populateInfo() {
     //Get the current userID
     var userId = firebase.auth().currentUser.uid;
     await firebase.database().ref('/meals/forSale').once('value', function(snapshot) {
           let tempArray = {};
           snapshot.forEach(function(childSnapshot) {
             var childData = childSnapshot.val();
             tempArray[childSnapshot.key] = childData;
           });
           this.setState({ mealsForSale: tempArray });
     }.bind(this));
     var temp = this.state.mealsForSale;

     await firebase.database().ref('/restaurants/' + this.props.navigation.state.params.locationData.owner + '/inventory/pickedUp').once('value', function(snapshot) {
            let tempArray = {};
            snapshot.forEach(function(childSnapshot) {
              var childData = childSnapshot.val();
              tempArray[childSnapshot.key] = childData;
            });
            this.setState({ pickedUp: tempArray });
      }.bind(this));
     var temp1 = this.state.pickedUp;

     //Get the user data
     await firebase.database().ref('/meals/locations/' + this.props.navigation.state.params.locationData.type + '/meals').once('value', function(snapshot) {
         let activeMeals = [];
         let pickedUpMeals = [];
         snapshot.forEach(function(childSnapshot) {
           childSnapshot.forEach(function(childChildSnapshot) {
                  var childData = childChildSnapshot.val();
                  if(temp[childData.idMeal.toString()]){
                     activeMeals.push(childData);
                  }
                  if(temp1[childData.idMeal.toString()]){
                     pickedUpMeals.push(childData);
                  }
           });
         });
         this.setState({ activeInventory: activeMeals });
         this.setState({ pickedUpMeals: pickedUpMeals})
     }.bind(this));

     return  firebase.database().ref('/restaurants/' + this.props.navigation.state.params.locationData.owner + '/inventory/claimed/' + this.props.navigation.state.params.locationData.type + '/').once('value', function(snapshot) {
                     let tempArray = [];
                     snapshot.forEach(function(childSnapshot) {
                        childSnapshot.forEach(function(childChildSnapshot) {
                           var childData = childChildSnapshot.val();
                           tempArray.push(childData);
                        });
                 });
         this.setState({ claimedInventory: tempArray });
     }.bind(this));
   }
   renderItemTemp ({item, index}, parallaxProps) {
        return (
            <TouchableOpacity key={index} onPress={() => {
                    this.props.navigation.navigate('Meal', {'title': item.strMeal,
                                                            'img': item.strMealThumb,
                                                            'cost': item.strCost,
                                                            'calories': item.calories,
                                                            'strCategory': item.strCategory,
                                                            'location': item.location,
                                                            'idMeal': item.idMeal,
                                                            'strIdMeal': "Meal ID #"+item.idMeal,
                                                            'shelfLife': item.shelfLife,
                                                            'datePackaged': item.strDatePackaged,
                                                            'pickedUp': item.pickedUp,
                                                            'datePurchased': item.strDatePurchased,
                                                            'forSale': item.forSale,
                                                            'name': item.name,
                                                            'headshot': item.headshot});
               }}>
                <View style={styles.currentOrdersContainer}>
                    <ChevronLeft/>
                    <View style={styles.imageContainers}>
                        <ParallaxImage
                            source={{ uri: item.strMealThumb }}
                            containerStyle={styles.orderImageContainer}
                            style={styles.orderImage}
                            parallaxFactor={0.4}
                            {...parallaxProps}
                        />
                        <Text style={styles.orderTitle} numberOfLines={2}>
                            { item.strMeal }
                        </Text>
                    </View>
                    <View style={styles.imageContainers}>
                        <ParallaxImage
                            source={{ uri: item.headshot }}
                            containerStyle={styles.orderImageContainer}
                            style={styles.orderImage}
                            parallaxFactor={0.4}
                            {...parallaxProps}
                        />
                        <Text style={styles.orderTitle} numberOfLines={2}>
                            { item.name }
                        </Text>
                    </View>
                    {index == this.state.claimedInventory-1 ? null:<Chevron/>}
                </View>
            </TouchableOpacity>

        );
   }

   get pagination () {
        const { claimedInventory, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={claimedInventory.length}
              activeDotIndex={activeSlide}
              containerStyle={{ backgroundColor: 'transparent', paddingBottom: 10, paddingTop: 10 }}
              dotStyle={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginHorizontal: 3,
                  backgroundColor: 'rgba(0, 0, 0, 0.92)'
              }}
              inactiveDotStyle={{
                  // Define styles for inactive dots here
              }}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.6}
            />
        );
   }
  renderClaimedCards = () => {
    if (!this.state.fontLoaded || this.state.claimedInventory == null){
        return null
    }

    let renderItem = this.renderItemTemp.bind(this);
    return (
        <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginBottom: 5, paddingBottom: 5, paddingHorizontal: 5, width: '95%', alignItems: 'center', alignSelf: 'center'}}>
           <Text style={styles.priceText}>{"Claimed Inventory"}</Text>
            { this.state.claimedInventory.length == 0 ? <View>
                                <Text style={styles.noItems}>No Meals to Display!</Text>
                            </View>:

                            <Carousel
                              data={this.state.claimedInventory}
                              renderItem={renderItem}
                              sliderWidth={sliderWidth}
                              itemWidth={itemWidth}
                              hasParallaxImages={true}
                              onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                            />}
            { this.pagination }
        </View>
    )
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

  render() {
    let params = this.props.navigation.state.params;
    if (!this.state.fontLoaded || this.state.activeInventory == null){
       return null
    }
    return (
        <View style={styles.mainviewStyle}>
            <ScrollView>
                {this.renderClaimedCards()}
                <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginBottom: 5, paddingBottom: 5, paddingHorizontal: 5, width: '95%',alignItems: 'center', alignSelf: 'center'}}>
                    <Text style={styles.priceText}>{"Active Inventory"}</Text>
                    <View style={styles.columnsContainer}>
                        <Text style={styles.columnLabel}>ID</Text>
                        <Text style={styles.columnLabel}>Meal Name</Text>
                        <Text style={styles.columnLabel}>Cuisine Category</Text>
                        <Text style={styles.columnLabel}>Cost</Text>
                    </View>
                    <ScrollView>
                      { this.state.activeInventory.length == 0 ? <View>
                                                      <Text style={styles.noItems}>No Meals to Display!</Text>
                                                  </View>:
                        this.state.activeInventory.map((datum, index) => {
                        return (
                          <TouchableOpacity key={index} onPress={() => {
                                this.props.navigation.navigate('Meal', {'title': datum.strMeal,
                                                                        'img': datum.strMealThumb,
                                                                        'cost': datum.strCost,
                                                                        'calories': datum.calories,
                                                                        'strCategory': datum.strCategory,
                                                                        'location': datum.location,
                                                                        'idMeal': datum.idMeal,
                                                                        'strIdMeal': "Meal ID #"+datum.idMeal,
                                                                        'shelfLife': datum.shelfLife,
                                                                        'datePackaged': datum.strDatePackaged,
                                                                        'pickedUp': datum.pickedUp,
                                                                        'datePurchased': datum.strDatePurchased,
                                                                        'forSale': datum.forSale});
                           }}>
                            <View style={styles.mealContainer}>
                              <Text style={styles.mealItem}>{datum.idMeal}</Text>
                              <Text style={styles.mealItem}>{datum.strMeal}</Text>
                              <Text style={styles.mealItem}>{datum.strCategory}</Text>
                              <Text style={styles.mealItem}>${datum.strCost}</Text>
                            </View>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                </View>
                { this.state.pickedUpMeals == null ? null:
                    <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginBottom: 5, paddingBottom: 5, paddingHorizontal: 5, width: '95%',alignItems: 'center', alignSelf: 'center'}}>
                        <Text style={styles.priceText}>{"Recently Picked Up"}</Text>
                        <View style={styles.columnsContainer}>
                            <Text style={styles.columnLabel}>ID</Text>
                            <Text style={styles.columnLabel}>Meal Name</Text>
                            <Text style={styles.columnLabel}>Cuisine Category</Text>
                            <Text style={styles.columnLabel}>Cost</Text>
                        </View>
                        { this.state.pickedUpMeals.length == 0 ?
                        <View>
                            <Text style={styles.noItems}>No Meals to Display!</Text>
                        </View>:
                        <ScrollView>
                          {this.state.pickedUpMeals.map((datum, index) => {
                            return (
                              <TouchableOpacity key={index} onPress={() => {
                                    this.props.navigation.navigate('Meal', {'title': datum.strMeal,
                                                                            'img': datum.strMealThumb,
                                                                            'cost': datum.strCost,
                                                                            'calories': datum.calories,
                                                                            'strCategory': datum.strCategory,
                                                                            'location': datum.location,
                                                                            'idMeal': datum.idMeal,
                                                                            'strIdMeal': "Meal ID #"+datum.idMeal,
                                                                            'shelfLife': datum.shelfLife,
                                                                            'datePackaged': datum.strDatePackaged,
                                                                            'pickedUp': datum.pickedUp,
                                                                            'datePurchased': datum.strDatePurchased,
                                                                            'forSale': datum.forSale,
                                                                            'headshot': datum.headshot,
                                                                            'name': datum.name});
                               }}>
                                <View style={styles.mealContainer}>
                                  <Text style={styles.mealItem}>{datum.idMeal}</Text>
                                  <Text style={styles.mealItem}>{datum.strMeal}</Text>
                                  <Text style={styles.mealItem}>{datum.strCategory}</Text>
                                  <Text style={styles.mealItem}>${datum.strCost}</Text>
                                </View>
                              </TouchableOpacity>
                            )
                          })}
                    </ScrollView>
                    }
                 </View>
             }
            </ScrollView>
        </View>
    )
  }
}

export default ActiveMeals;

const styles = StyleSheet.create({
cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    height: Dimensions.get('window').width * (3 / 4),
    width: Dimensions.get('window').width,
  },
  lineItemContainer : {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
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
    margin: 15,
  },
  slide: {
    marginTop: 15,
    overflow: 'visible' // for custom animations
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 24,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Poor Story',
    marginVertical: 10,
  },
  noItems: {
    alignSelf: 'center',
    color: 'black',
    fontFamily: 'Poor Story',
    fontSize: 22,
    marginVertical: 30,
  },
  orderTitle: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Poor Story',
    marginVertical: 10,
  },
  mainviewStyle: {
    flex: 1,
    flexDirection: 'column',
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
  infoContainer: {
    alignItems: 'center',
    flex: 1,
    width: '90%',
    alignSelf: 'center'
  },
  mealContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10,
  },
  priceText: {
      marginVertical: 20,
      letterSpacing: 1,
      color: Colors.black,
      fontSize: 28,
      fontFamily: 'Poor Story',
      alignSelf: 'center',
    },
  mealItem:{
    fontFamily: 'Poor Story',
    textAlign: 'center',
    fontSize: 12,
    width: '25%',
    alignSelf: 'center',
    color: 'black',
  },
  mealsContainer:{
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderBottomWidth: 0.5,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'space-between'
  },
  currentOrdersContainer:{
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    height: SCREEN_HEIGHT*0.2,
    backgroundColor: '#fff'
  },
  imageContainers: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  orderImageContainer:{
    width: '50%',
    height: '50%',
    alignSelf: 'center',
  },
  orderImage:{
    alignSelf: 'center',
  },
  mealsLabel:{
    fontFamily: 'Poor Story',
    textAlign: 'center',
    fontSize: 24,
    width: '90%',
    alignSelf: 'center',
    padding: 10,
  },
  columnsContainer: {
    flex: .1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    width: '90%',
    alignSelf: 'flex-start',
    paddingBottom: 5,
  },
  columnLabel:{
      fontFamily: 'Poor Story',
      textAlign: 'center',
      fontSize: 14,
      width: '27%',
      alignSelf: 'center',
    },
  navigatorButton: {
    alignItems: 'flex-start',
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
    color: Colors.black,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: 'Poor Story',
  },
  subDetailText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '100',
    lineHeight: 28,
    letterSpacing: 0.5,
    fontFamily: 'Poor Story',
  },
  descriptionText: {
    marginBottom: 4,
    color: Colors.gray,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1,
    fontFamily: 'Poor Story',
  },
});
