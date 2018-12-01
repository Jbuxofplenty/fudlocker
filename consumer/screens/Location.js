import React, { Component } from 'react'
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native'
import PropTypes from 'prop-types'
import { Font } from 'expo'

import { Colors } from '../constants'
const dateformat = require('dateformat');
import getDirections from 'react-native-google-maps-directions';

import farrand_data from '../assets/dynamic_data/meals_farrand.json';
import c4c_data from '../assets/dynamic_data/meals_c4c.json';
import village_data from '../assets/dynamic_data/meals_village.json';
import all_data from '../assets/dynamic_data/all_meals.json';


const meal_data = {
    'Farrand': farrand_data.meals,
    'C4C': c4c_data.meals,
    'Village': village_data.meals,
    'All': all_data.meals,
}

class Location extends Component {
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
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });
    var temp = this.props.navigation.state.params;
    this.setState({ fontLoaded: true, paramsLoaded: true });
    }
  renderDetail = () => {
    return (
      <View>
        <Text style={styles.subDetailText}>{this.props.navigation.state.params.detail}</Text>
      </View>
    )
  }


  renderDescription = () => {
    if (this.props.navigation.state.params.cost==0 || !this.state.fontLoaded){
        return null
    }
    return (
    <View>
        <View style={styles.infoContainer}>
            <Text style={styles.priceText}>{this.props.navigation.state.params.title}</Text>
            <Text style={styles.descriptionText}>{this.props.navigation.state.params.detail}</Text>
            <View style={styles.mealsContainer}>
                <Text style={styles.mealsLabel}>Meals</Text>
                <View style={styles.columnsContainer}>
                    <Text style={styles.columnLabel}>ID</Text>
                    <Text style={styles.columnLabel}>Meal Name</Text>
                    <Text style={styles.columnLabel}>Cuisine Category</Text>
                    <Text style={styles.columnLabel}>Cost</Text>
                </View>
            </View>
            <ScrollView>
              {meal_data[this.props.navigation.state.params.meal_type].map(datum => {
                return (
                  <TouchableOpacity key={datum.strMeal} onPress={() => {
                        title = datum.strMeal;
                        img = datum.strMealThumb;
                        location = datum.location;
                        strCategory = datum.strCategory;
                        cost = datum.strCost;
                        calories = datum.calories;
                        desc = datum.desc;
                        this.props.navigation.navigate('Meal', {'title': title, 'img': img, 'detail': desc, 'cost': cost, 'calories':calories, 'strCategory': strCategory, 'location': location});
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
      this.setState({your_lat: location.coords.latitdude});
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

      handleGetDirections () {
              const data = {
                source: {
                 latitude: this.state.your_lat,
                 longitude: this.state.your_lng
           },
               destination: {
                 latitude: this.props.navigation.state.params.lat,
                 longitude: this.props.navigation.state.params.lng
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

  render() {
    let params = this.props.navigation.state.params;
    if (this.props.navigation.state.params.cost==0){
            return null
          }
    return (

      <View style={styles.mainviewStyle}>
        { params && this.state.fontLoaded ?
        <View style={styles.mainviewStyle}>
        <ScrollView style={styles.scroll}>
          <View style={[styles.container, this.props.containerStyle]}>
          <View style={styles.cardContainer}>
              {this.renderContactHeader()}
          </View>
          </View>
         <View style={styles.productRow}>{this.renderDescription()}</View>

        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity onPress={()=>{this.handleGetDirections()}} style={styles.buttonFooter}>
            <Text style={styles.buttonText}>Directions</Text>
          </TouchableOpacity>
          <View style={styles.borderCenter} />
          <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Meals', {'meal_type': this.props.navigation.state.params.meal_type})}} style={styles.buttonFooter}>
            <Text style={styles.buttonText}>Meals</Text>
          </TouchableOpacity>
        </View>
        </View>
        : null }
      </View>
    )
  }
}

export default Location;

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
  mainviewStyle: {
    flex: 1,
    flexGrow: 1,
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
        fontSize: 14,
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
