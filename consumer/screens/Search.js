import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, ScrollView, Image, Button, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Constants, Location, Permissions, Font } from 'expo';
import FontText from './FontText';
import SearchInput, { createFilter } from 'react-native-search-filter';

import location_data from '../assets/static_data/fudlkr_locations.json';
import all_meals_data from '../assets/dynamic_data/all_meals.json';
import category_data from '../assets/static_data/meal_categories.json';

const locations = location_data.data;

const KEYS_TO_FILTERS = ['title', 'meals.strMeal', 'strCategory'];

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            searching:
            coords: null,
            location: null,
            errorMessage: null,
            fontLoaded: false,
            markers: locations
        }
      }
      searchUpdated(term) {
        this.setState({ searchTerm: term })
      }

    location_selected = false;

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

  render() {

      let d = all_meals_data.meals;
      const filtered_data = d.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
      if (this.state.fontLoaded){

      return (

          <View style={{ flex: 1 }}>

           <SearchBar
              style={{zIndex: 3}}
              onChangeText={(term) => { this.searchUpdated(term) }}
              round
              placeholder="Find Fud"
              lightTheme
              showLoading
              showsCancelButtonWhileEditing={false}
              inputStyle={{fontFamily: 'Poor Story'}}

             />
                 <ScrollView>
                  {filtered_data.map(datum => {
                    return (
                      <TouchableOpacity onPress={()=>alert('hi')} key={datum.strMeal} style={styles.emailItem}>
                        <View>
                          <Text>{datum.strMeal}</Text>
                          <Text style={styles.emailSubject}>{datum.strMeal}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
             </View>
      );
      }
      else{
        return null
      }

  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start'
  },
  emailItem:{
    borderBottomWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    padding: 10
  },
  emailSubject: {
    color: 'rgba(0,0,0,0.5)'
  },
  searchInput:{
    padding: 10,
    borderColor: '#CCC',
    borderWidth: 1
  }
});


