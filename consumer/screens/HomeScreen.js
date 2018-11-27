import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, Button, TouchableOpacity, TouchableHighlight, SectionList, Keyboard } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Constants, Location, Permissions, Font } from 'expo';
import MapView, { Marker, Callout } from 'react-native-maps'
import FontText from './FontText';
import getDirections from 'react-native-google-maps-directions';
import { NavigationActions } from 'react-navigation';
import { createFilter } from 'react-native-search-filter';

import LOCATION_DATA from '../assets/static_data/fudlkr_locations.json';
import ALL_MEALS_DATA from '../assets/dynamic_data/all_meals.json';
import CATEGORY_DATA from '../assets/static_data/meal_categories.json';

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

export default class Home extends Component {
    static navigationOptions = {
          title: 'Home',
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
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: '',
            searching: false,
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
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
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
    this.state.searching = false;
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
    var coords = this.regionFrom(location.coords.latitude, location.coords.longitude, 20000);
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
  toggleSearching () {
    Keyboard.dismiss();
    this.setState({ searching: !this.state.searching });
    this.setState({ searchTerm: '' });
  }

  _renderLocationItem(item, section) {
    return (
        <View style={{backgroundColor: '#fff', marginBottom: 5, paddingTop: 5, borderStyle: 'solid', borderTopWidth: 1, borderTopColor: 'grey'}}>
            <TouchableHighlight onPress={() => {
                 this.toggleSearching();
                 this.props.navigation.navigate('Location', {'title': item.title, 'img': item.image, 'detail': item.description, 'meal_type': item.type, 'lat': item.latlng.latitude, 'lng': item.latlng.longitude });
                            }}>
                 <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                 <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={{fontFamily: 'Poor Story', fontSize: 20, marginLeft: 10}}>{`${item.title}`}</Text>
                        <View style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'Poor Story', marginLeft: 20}}>{`${item.description}`}</Text>
                        </View>
                      </View>
                      <Image source={{ uri: item.image }} style={{width: 48, height: 48, marginRight: 20}}></Image>
                 </View>
            </TouchableHighlight>
          </View>
    )
  }
  _renderMealItem(item, section) {
      return (
        <View style={{backgroundColor: '#fff', marginBottom: 5, paddingTop: 5, borderStyle: 'solid', borderTopWidth: 1, borderTopColor: 'grey'}}>
            <TouchableHighlight onPress={() => {
                    title = item.strMeal;
                    img = item.strMealThumb;
                    location = item.location;
                    data_location = item.strSourceData;
                    cost = item.strCost;
                    calories = item.calories;
                    desc = item.desc;
                    this.toggleSearching();
                    this.props.navigation.navigate('Meal', {'title': title, 'img': img, 'detail': desc, 'cost': cost, 'calories':calories, 'data_location': data_location, 'location': location});
            }}>
                 <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                 <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={{fontFamily: 'Poor Story', fontSize: 20, marginLeft: 10}}>{`${item.strMeal}`}</Text>
                        <View style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'Poor Story', marginLeft: 20}}>${`${item.strCost}`}</Text>
                            <Text style={{fontFamily: 'Poor Story', marginLeft: 40}}>{`${locs[item.location]}`}</Text>
                        </View>
                      </View>
                      <Image source={{ uri: item.strMealThumb }} style={{width: 48, height: 48, marginRight: 20}}></Image>
                 </View>
            </TouchableHighlight>
          </View>
      )
    }
  _renderCategoryItem(item, section) {
      return (
      <View style={{backgroundColor: '#fff', marginBottom: 5, paddingTop: 5, borderStyle: 'solid', borderTopWidth: 1, borderTopColor: 'grey'}}>
          <TouchableHighlight onPress={() => {
                  meal_type = item.strCategory;
                  this.toggleSearching();
                  this.props.navigation.navigate('Meals', {'meal_type': meal_type});
                  }}>
               <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
               <View style={{flex: 1, flexDirection: 'column'}}>
                      <Text style={{fontFamily: 'Poor Story', fontSize: 20, marginLeft: 10}}>{`${item.strCategory}`}</Text>
                    </View>
                    <Image source={{ uri: item.strCategoryThumb }} style={{width: 48, height: 48, marginRight: 20}}></Image>
               </View>
          </TouchableHighlight>
        </View>
      )
    }
  _renderSectionHeader = ({section}) => {
        return (
          <View style={styles.sectionHeader}>
            <Text style={styles.header}>{section.title}</Text>
          </View>
        )
    }

  render() {
      let ps = this.props;
        if(this.props.navigation.state.params != null && !this.location_selected) {
            this.location_selected = true;
            var coords = this.regionFrom(this.props.navigation.state.params.coords.latitude, this.props.navigation.state.params.coords.longitude, 1000);
            this.state.coords=coords;
        }
        const data = [LOCATIONS, ALL_MEALS, CATEGORIES];
        const keys = [LOCATION_KEYS_TO_FILTERS, MEAL_KEYS_TO_FILTERS, CATEGORY_KEYS_TO_FILTERS];
        const scopes = ["Locations", "Meals", "Categories"];
        const filtered_data = [];
        for (index = 0; index < data.length; ++index) {
            filtered_datum = data[index].filter(createFilter(this.state.searchTerm, keys[index]));
            filtered_data.push(filtered_datum);
        }

        const renderLocationItem = ({item, section}) => (this._renderLocationItem(item, section))
        const renderMealItem = ({item, section}) => (this._renderMealItem(item, section))
        const renderCategoryItem = ({item, section}) => (this._renderCategoryItem(item, section))
        const SearchResults = ({show}) =>
        <View style={{height: show ? "100%" : 0, backgroundColor: '#fff'}}>
            <SectionList
              renderItem={this._renderLocationItem}
              renderSectionHeader={this._renderSectionHeader}
              sections={[
                { title: scopes[0], data: filtered_data[0], renderItem: renderLocationItem },
                { title: scopes[1], data: filtered_data[1], renderItem: renderMealItem  },
                { title: scopes[2], data: filtered_data[2], renderItem: renderCategoryItem },
              ]}
              keyExtractor={(item, index) => item + index}

            />
        </View>
      return (

      <View style={{ flex: 1 }}>
      {
         ps && this.state.fontLoaded ? (
         <View>
           <SearchBar
              onChangeText={(term) => { this.searchUpdated(term) }}
              onCancel={() => {this.toggleSearching()}}
              onClear={() => {this.toggleSearching()}}
              round
              platform="android"
              clearIcon={{ type: 'font-awesome', name: 'chevron-left' }}
              placeholder="Find F&#xFC;d"
              lightTheme
              showLoading
              inputStyle={{fontFamily: 'Poor Story'}}
              value={this.state.searchTerm}

             />
           <SearchResults show={this.state.searching}/>
        </View>

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
                >
                      <Callout tooltip={true} onPress={()=>{this.props.navigation.navigate('Location', {'title': marker.title, 'img': marker.image, 'detail': marker.description, 'meal_type': marker.type, 'lat': marker.latlng.latitude, 'lng': marker.latlng.longitude })}}>
                        <View style={styles.tooltip}>
                            <Text style={styles.title}>{marker.title}</Text>
                            <Text style={styles.description}>{marker.description}</Text>
                        </View>
                      </Callout>
              </Marker>
            ))}
        </MapView>
        </View>
      );
  }
}


const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start'
    },
  tooltip: {
        flex: 1,
        backgroundColor: '#2ECC71',
        justifyContent: 'flex-start',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
    },
  title: {
        fontFamily: 'Poor Story',
        fontSize: 16,
        color: '#fff',
    },
  description: {
        fontFamily: 'Poor Story',
        fontSize: 12,
        color: '#fff',
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
    }

});


