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
import fudlkr_locations from '../assets/static_data/fudlkr_locations.json';

class Meal extends Component {
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

          handleGetDirections () {
                var arrayLength = fudlkr_locations.data.length;
                   for (var i = 0; i < arrayLength; i++) {
                      if( fudlkr_locations.data[i].type == this.props.navigation.state.params.location) {
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
      <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginBottom: 5, paddingBottom: 5, paddingHorizontal: 5}}>
          <Text style={styles.priceText}>${this.props.navigation.state.params.cost}</Text>
          <Text style={styles.descriptionText}>{this.props.navigation.state.params.title}</Text>
          <View style={styles.lineItemContainer} >
              <Text style={styles.labelText}>Cuisine Category:</Text>
              <Text style={styles.valueText}>{this.props.navigation.state.params.strCategory}</Text>
          </View>
          <View style={styles.lineItemContainer} >
              <Text style={styles.labelText}>Estimated Calories:</Text>
              <Text style={styles.valueText}>{this.props.navigation.state.params.calories}</Text>
          </View>
          <View style={styles.lineItemContainer} >
              <Text style={styles.labelText}>Date Packaged:</Text>
              <Text style={styles.valueText}>{this.randomDate(0,5)}</Text>
          </View>
          <View style={styles.lineItemContainer} >
            <Text style={styles.labelText}>Location:</Text>
            <Text style={styles.valueText}>{this.props.navigation.state.params.location}</Text>
        </View>
      </View>
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
          <TouchableOpacity style={styles.buttonFooter} onPress={() => {
                    title = params.title;
                    img = params.img;
                    location = params.location;
                    strCategory = params.strCategory;
                    cost = params.cost;
                    calories = params.calories;
                    desc = "Purchase " + params.title;
                    this.props.navigation.navigate('Purchase', {'title': title, 'idMeal': this.props.navigation.state.params.idMeal, 'img': img, 'detail': desc, 'cost': cost, 'calories':calories, 'strCategory': strCategory, 'location': location});
               }}>
            <Text style={styles.buttonText}>Purchase</Text>
          </TouchableOpacity>
         </View>
        </View>
        : null }
      </View>
    )
  }
}

export default Meal;

const styles = StyleSheet.create({
cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly'
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
  labelText: {
  fontFamily: 'Poor Story',
  fontSize: 18,
  color: 'black',
  width: '50%',
  textAlignVertical: 'center',
  textAlign: 'left',
  paddingLeft: 5,
},
location: {
    fontFamily: 'Poor Story',
    fontSize: 24,
    color: 'black',
    width: '100%',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
valueText: {
  fontFamily: 'Poor Story',
  fontSize: 18,
  width: '50%',
  color: 'black',
  textAlignVertical: 'center',
  textAlign: 'right',
  paddingRight: 5,
},
  priceText: {
    marginBottom: 5,
    letterSpacing: 1,
    color: Colors.black,
    fontSize: 36,
    fontWeight: '400',
    fontFamily: 'Poor Story',
    alignSelf: 'center'
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
    alignSelf: 'center',
  },
});
