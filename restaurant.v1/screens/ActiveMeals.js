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
        location_data: null,
        location: null,
        title: null,
        activeSlide: 0,
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
     return firebase.database().ref('/meals/locations/' + this.props.navigation.state.params.location_data.type + '/meals').once('value').then(function(snapshot) {
         let tempArray = [];
         snapshot.forEach(function(childSnapshot) {
           var childData = childSnapshot.val();
           tempArray.push(childData);
         });
         this.setState({ location_data: tempArray });
         this.setState({ location: this.props.navigation.state.params.location_data.type });
         this.setState({ title: this.props.navigation.state.params.location_data.title });
     }.bind(this));
   }
   renderItem ({item, index}, parallaxProps) {
        return (
            <View style={styles.currentOrdersContainer}>
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
        );
   }
   get pagination () {
        const { location_data, activeSlide } = this.state;
        return (
            <Pagination
              dotsLength={location_data.length}
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
    if (!this.state.fontLoaded || this.state.location_data == null){
        return null
    }
    return (
        <View>
            <Carousel
              data={this.state.location_data}
              renderItem={this.renderItem}
              sliderWidth={sliderWidth}
              itemWidth={itemWidth}
              hasParallaxImages={true}
              onSnapToItem={(index) => this.setState({ activeSlide: index }) }
            />
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
    if (!this.state.fontLoaded || this.state.location_data == null){
       return null
    }
    return (
      <View style={styles.mainviewStyle}>
        <Text style={styles.title}>Claimed Inventory</Text>
        {this.renderClaimedCards()}
        <View style={styles.infoContainer}>
            <View style={styles.mealsContainer}>
                <Text style={[styles.title, {marginTop: 0}]}>Active Inventory</Text>
                <View style={styles.columnsContainer}>
                    <Text style={styles.columnLabel}>ID</Text>
                    <Text style={styles.columnLabel}>Meal Name</Text>
                    <Text style={styles.columnLabel}>Cuisine Category</Text>
                    <Text style={styles.columnLabel}>Cost</Text>
                </View>
            </View>
            <ScrollView>
              {this.state.location_data.map(datum => {
                return (
                  <TouchableOpacity key={datum.strMeal} onPress={() => {
                        title = datum.strMeal;
                        img = datum.strMealThumb;
                        location = datum.location;
                        strCategory = datum.strCategory;
                        cost = datum.strCost;
                        calories = datum.calories;
                        desc = datum.desc;
                        idMeal = datum.idMeal;
                        this.props.navigation.navigate('Meal', {'title': title, 'img': img, 'detail': desc, 'cost': cost, 'calories':calories, 'strCategory': strCategory, 'location': location, 'idMeal': idMeal});
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
  mealItem:{
    fontFamily: 'Poor Story',
    textAlign: 'center',
    fontSize: 12,
    width: '25%',
    alignSelf: 'center',
    color: 'darkgray',
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
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    height: SCREEN_HEIGHT*0.2,
    backgroundColor: '#2ECC71'
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
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columnLabel:{
      fontFamily: 'Poor Story',
      textAlign: 'center',
      fontSize: 12,
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
