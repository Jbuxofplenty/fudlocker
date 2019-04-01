import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Image, Button, TouchableOpacity, TouchableHighlight, SectionList, Keyboard } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { Constants, Location, Permissions, Font } from 'expo';
import MapView, { Marker, Callout } from 'react-native-maps'
import FontText from './FontText';
import getDirections from 'react-native-google-maps-directions';
import { NavigationActions } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import { createFilter } from 'react-native-search-filter';
import * as firebase from 'firebase';

const locs = {
    "C4C": "Center for Community",
    "Farrand": "Farrand Hall",
    "Village": "Village Center Dining"
};

const GOOGLE_MAPS_APIKEY = 'AIzaSyAXOX7B2DGxHN9SK3FwMaqkP8Q_LE0MAvo';

const LOCATION_KEYS_TO_FILTERS = ['title', 'description'];
const MEAL_KEYS_TO_FILTERS = ['strMeal', 'datePackaged', 'calories'];
const CATEGORY_KEYS_TO_FILTERS = ['title'];

export default class Home extends Component {
static navigationOptions = ({ navigation }) => {
       return {
          title: "Home",
          headerLeft: (<View></View>),
    }
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
            markers: null,
            mealRadius: null,
            meals_data: null,
            meal_type: null,
            category_data: null,
            locations: null,
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
    this.populateInfo();

}

  componentWillMount() {
    this.state.searching = false;
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
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
    var coords = this.regionFrom(location.coords.latitude, location.coords.longitude, this.state.mealRadius*1609.34);
    if(!this.location_selected){
        this.setState({coords: coords});
    }
  };

    populateInfo = async () => {
        //Get the current userID
        let location = await Location.getCurrentPositionAsync({});
        var userId = firebase.auth().currentUser.uid;
        //Get the user data
        await firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
            this.setState({ mealRadius: snapshot.val().mealRadius });
            var coords = this.regionFrom(location.coords.latitude, location.coords.longitude, snapshot.val().mealRadius*1609.34);
            if(!this.location_selected){
                this.setState({coords: coords});
            }
        }.bind(this));
        await firebase.database().ref('/lockers/data').once('value').then(function(snapshot) {
            let tempArray = [];
            snapshot.forEach(function(childSnapshot) {
                var childData = childSnapshot.val();
                tempArray.push(childData);
            });
            this.setState({ markers: tempArray });
        }.bind(this));
        await firebase.database().ref('/meals/forSale').once('value').then(function(snapshot) {
               let tempArray = {};
               snapshot.forEach(function(childSnapshot) {
                 var childData = childSnapshot.val();
                 tempArray[childSnapshot.key] = childData;
               });
               this.setState({ meals_forSale: tempArray });
           }.bind(this));
        var temp = this.state.meals_forSale;
        await firebase.database().ref('/meals/all/meals').once('value').then(function(snapshot) {
           let tempArray = [];
           snapshot.forEach(function(childSnapshot) {
             childSnapshot.forEach(function(childChildSnapshot) {
                  var childData = childChildSnapshot.val();
                  if(temp[childData.idMeal.toString()]){
                    tempArray.push(childData);
                  }
             });
           });
           this.setState({ meals_data: tempArray });
           this.setState({ meal_type: "All" });
       }.bind(this));
       await firebase.database().ref('/lockers/data').once('value', function(snapshot) {
             let tempArray = {};
             snapshot.forEach(function(childSnapshot) {
               var childData = childSnapshot.val();
               tempArray[childData.type] = childData;
             });
             this.setState({ locations: tempArray });
       }.bind(this));
       await firebase.database().ref('/static/mealCategories').once('value').then(function(snapshot) {
           this.setState({ category_data: snapshot.val().meal_categories });
       }.bind(this));
      }

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
                    idMeal = item.idMeal;
                    this.toggleSearching();
                    this.props.navigation.navigate('Meal', {'title': title, 'img': img, 'detail': desc, 'cost': cost, 'calories':calories, 'data_location': data_location, 'location': location, idMeal: idMeal});
            }}>
                 <View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                 <View style={{flex: 1, flexDirection: 'column'}}>
                        <Text style={{fontFamily: 'Poor Story', fontSize: 20, marginLeft: 10}}>{`${item.strMeal}`}</Text>
                        <View style={{flex: 1, justifyContent: 'flex-start', flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'Poor Story', marginLeft: 20}}>${`${item.strCost}`}</Text>
                            <Text style={{fontFamily: 'Poor Story', marginLeft: 40}}>{`${this.state.locations[item.location].type}`}</Text>
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
                      <Text style={{fontFamily: 'Poor Story', fontSize: 20, marginLeft: 10}}>{`${item.title}`}</Text>
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
    if(this.state.markers != null && this.state.meals_data != null && this.state.category_data != null) {
      let ps = this.props;
        if(this.props.navigation.state.params != null && !this.location_selected) {
            this.location_selected = true;
            var coords = this.regionFrom(this.props.navigation.state.params.coords.latitude, this.props.navigation.state.params.coords.longitude, 1000);
            this.state.coords=coords;
        }
        const data = [this.state.markers, this.state.meals_data, this.state.category_data];
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
             ps && this.state.fontLoaded && this.state.mealRadius != null ? (
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
                          <Callout tooltip={true} onPress={()=>{this.props.navigation.navigate('Location', {'title': marker.title, 'img': marker.image, 'detail': marker.description, 'meal_type': marker.type, 'title': marker.title, 'lat': marker.latlng.latitude, 'lng': marker.latlng.longitude })}}>
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
      else {
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


