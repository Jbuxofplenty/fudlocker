import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, StatusBar } from 'react-native';
import { SearchBar } from 'react-native-elements'
import { Constants, Location, Permissions, Font } from 'expo';
import MapView from 'react-native-maps'
import FontText from './FontText';


export default class App extends Component {
  state = {
    coords: null,
    location: null,
    errorMessage: null,
    fontLoaded: false,
  };

   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
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

    var coords = this.regionFrom(location.coords.latitude, location.coords.longitude, 10000);
    this.setState({coords: coords});
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
   search() {

   }
   renderMarkers() {

   }

  render() {
      return (

      <View style={{ flex: 1 }}>
      {
         this.state.fontLoaded ? (
           <SearchBar
             ref='searchBar'
             placeholder='Find fud'
             round
             onChangeText={this.search}
             lightTheme
             showLoading
             showsCancelButtonWhileEditing={false}
             inputStyle={{fontFamily: 'Poor Story'}}
           />

         ) : null
      }


        <MapView
                  style={{
                    flex: 1
                  }}
                  region={this.state.coords}
              />
      </View>
      );
      this.renderMarkers();
  }
}


