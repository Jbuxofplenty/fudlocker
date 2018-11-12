import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, StatusBar, Image } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Constants, Location, Permissions, Font } from 'expo';
import MapView, { Marker, Callout } from 'react-native-maps'
import FontText from './FontText';
import image from '../assets/images/c4c.jpg';

const locations = [
{ latlng: {latitude: 40.005798, longitude: -105.265827}, title: 'Farrand Hall', description: 'Locker consisting of 6 individual meals', id: 1 },
{ latlng: {latitude: 40.004358, longitude: -105.265044}, title: 'Center for Community (C4C)', description: 'Locker consisting of 12 individual meals', id: 2 },
{ latlng: {latitude: 39.997540, longitude: -105.251878}, title: 'Village Center Dining', description: 'Locker consisting of 12 individual meals', id: 3 }
];
const GOOGLE_MAPS_APIKEY = 'AIzaSyAXOX7B2DGxHN9SK3FwMaqkP8Q_LE0MAvo';

export default class App extends Component {
  state = {
    coords: null,
    location: null,
    errorMessage: null,
    fontLoaded: false,
    markers: locations
  };

   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });
    await Font.loadAsync({
        'MaterialIcons': require('@expo/vector-icons/fonts/MaterialIcons.ttf')
    })

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

    var coords = this.regionFrom(location.coords.latitude, location.coords.longitude, 1000);
    var coords = this.regionFrom(40.002689, -105.262194, 1200);
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
         >
         {this.state.markers.map(marker => (
              <Marker
                coordinate={marker.latlng}
                title={marker.title}
                description={marker.description}
                key={marker.id}
                />
//                      <Callout>
////                        <View>
////                          <Image
////                             source={require('../assets/images/c4c.jpg')}
////                           />
////                        </View>
//                        <Text>Work in Progress!</Text>
//                      </Callout>
//              </Marker>
            ))}
        </MapView>
      </View>
      );
      this.renderMarkers();
  }
}


