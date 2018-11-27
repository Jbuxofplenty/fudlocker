import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, Button, TouchableOpacity, TouchableHighlight, SectionList, Keyboard, TextInput, Modal } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Constants, Location, Permissions, Font } from 'expo';
import MapView, { Marker, Callout, Circle } from 'react-native-maps'
import getDirections from 'react-native-google-maps-directions';
import { NavigationActions } from 'react-navigation';
import { createFilter } from 'react-native-search-filter';

import LOCATION_DATA from '../../assets/static_data/fudlkr_locations.json';
import ALL_MEALS_DATA from '../../assets/dynamic_data/all_meals.json';
import CATEGORY_DATA from '../../assets/static_data/meal_categories.json';

const LOCATIONS = LOCATION_DATA.data;
const ALL_MEALS = ALL_MEALS_DATA.meals;
const CATEGORIES = CATEGORY_DATA.meal_categories;
const locs = {
    "C4C": "Center for Community",
    "Farrand": "Farrand Hall",
    "Village": "Village Center Dining"
};

const GOOGLE_MAPS_APIKEY = 'AIzaSyAXOX7B2DGxHN9SK3FwMaqkP8Q_LE0MAvo';

const LOCATION_KEYS_TO_FILTERS = ['title', 'description'];
const MEAL_KEYS_TO_FILTERS = ['strMeal', 'datePackaged', 'calories'];
const CATEGORY_KEYS_TO_FILTERS = ['strCategory'];

export default class MealRadius extends Component {
    static navigationOptions = {
          title: 'Meal Radius',
          headerStyle: {
            backgroundColor: '#2ECC71',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            flex: 1,
          },
          headerRight: (<View></View>),
      };
    constructor(props) {
        super(props);
        this.state = {
            radius: this.props.navigation.state.params.radius,
            newRadius: '',
            modalVisible: false,
            coords: null,
            location: null,
            errorMessage: null,
            fontLoaded: false,
            markers: LOCATIONS
        }
      }
      searchUpdated(term) {
        if(term == ''){
            this.setState({ searching: false });
        }
        else {
            this.setState({ searching: true });
        }
        this.setState({ searchTerm: term });
      }

    location_selected = false;

   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../../assets/fonts/PoorStory-Regular.ttf'),
    });
    await Font.loadAsync({
        'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')
    });
    await Font.loadAsync({
        'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf')
    });

    this.setState({ fontLoaded: true });
}

  componentWillMount() {

    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });


    }
    let location = await Location.getCurrentPositionAsync({});
    var coords = this.regionFrom(location.coords.latitude, location.coords.longitude, this.state.radius*2*1609.34);
    if(!this.location_selected){
        this.setState({coords: coords});
    }
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

    sleep(miliseconds) {
       var currentTime = new Date().getTime();

       while (currentTime + miliseconds >= new Date().getTime()) {
       }
    }

    validateRadius = () => {
    var temp = parseFloat(this.state.newRadius);
    if( isNaN(temp) ){
        this.setState({modalVisible: true});
        this.setState({ newRadius: "" });
    }
    else {
        this.setState({ newRadius: "" });
        this.setState({ radius: temp });
        var coords = this.regionFrom(this.state.coords.latitude, this.state.coords.longitude, temp*2*1609.34);
        this.setState({ coords: coords });
    }
    };

    closeModal = () => {
        this.setState({ modalVisible: false });
        this.setState({ newRadius: "" });
    };

  render() {
      if(this.state.coords != null) {
          return (
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', height: 40, backgroundColor: 'darkgray', borderWidth: 1, borderRadius: 25, borderColor: 'black'}}>
                <View style={{ textAlign: 'left', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', float: 'left', width: '50%' }}>
                    <Text style={{height: 40, textAlign: 'left', textAlignVertical: 'center', fontFamily: 'Poor Story'}}>
                        Current Radius: {'\t'} {this.state.radius + " miles"}
                    </Text>
                </View>
                <View style={{ textAlign: 'right', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', float: 'right', width: '50%' }}>
                    <Text style={{height: 40, textAlign: 'right', textAlignVertical: 'center', fontFamily: 'Poor Story'}}>
                                    New Radius: {'\t'}
                                </Text>
                    <TextInput
                          style={{height: 30, borderRadius: 10, width: '25%', textAlign: 'center', fontFamily: 'Poor Story', backgroundColor: 'white'}}
                          onChangeText={(newRadius) => this.setState({newRadius})}
                          onEndEditing={() => this.validateRadius()}
                          value={this.state.newRadius}
                        />
                </View>
            </View>
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={this.closeModal}
            >
              <View style={styles.modalContainer}>
                <Text style={styles.title}>
                  {"Invalid Input! "}
                </Text>
                <Text style={styles.description}>
                  {"Please enter a valid radius in miles. \n\n"}
                </Text>
                <Button
                  color="#ABEBC6"
                  onPress={this.closeModal}
                  title="    OK    "
                />
              </View>
            </Modal>

            <MapView
              style={{
                flex: 1
              }}
              region={this.state.coords}
             >
             {<Circle
                 center={{latitude: this.state.coords.latitude, longitude: this.state.coords.longitude}}
                 radius={this.state.radius*1609.34}
                 fillColor="rgba(255,0,0,0.25)"
                 strokeColor="black"
              />}
             {this.state.markers.map(marker => (
                  <Marker
                    coordinate={marker.latlng}
                    title={marker.title}
                    description={marker.description}
                    key={marker.id}
                    >
                  </Marker>
                ))}
            </MapView>
            </View>
          );
      }
      else {return null}
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  searchInput:{
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
  },
    sectionHeader: {
        height: 50,
        flex: 1,
        backgroundColor: '#464849',
        justifyContent: 'center',
        paddingLeft: 10,
        borderTopWidth: 2,
        borderTopColor: 'black'
    },
    header: {
        fontSize: 26,
        fontFamily: 'Poor Story',
        color: 'white'
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


