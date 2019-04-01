import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Linking,
	Image,
	ActivityIndicator,
	Dimensions,
	TouchableHighlight,
	ImageBackground
	} from 'react-native';

import GridView from 'react-native-super-grid';
import { LinearGradient, Font } from 'expo';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class Meals extends Component {
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
        meals_data: null,
        meal_type: null,
        meals_forSale: null,
     };
    async componentDidMount() {
        await Font.loadAsync({
            'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
        });
        this.setState({ fontLoaded: true });
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
              this.setState({ meals_forSale: tempArray });
          }.bind(this));
     var temp = this.state.meals_forSale;
     await firebase.database().ref('/meals/forSale').on('value', function(snapshot) {
           let tempArray = {};
           snapshot.forEach(function(childSnapshot) {
             var childData = childSnapshot.val();
             tempArray[childSnapshot.key] = childData;
           });
           this.setState({ meals_forSale: tempArray });
       }.bind(this));
     //Get the user data
     if(this.props.navigation.state.params.meal_type == "All") {
         await firebase.database().ref('/meals/all/meals').once('value', function(snapshot) {
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
             this.setState({ meal_type: this.props.navigation.state.params.meal_type });
         }.bind(this));
     }
     else if(this.props.navigation.state.params.meal_type.toLowerCase() == "farrand" || this.props.navigation.state.params.meal_type.toLowerCase() == "c4c" || this.props.navigation.state.params.meal_type.toLowerCase() == "village") {
       await firebase.database().ref('/meals/locations/' + this.props.navigation.state.params.meal_type.toLowerCase() + '/meals').once('value', function(snapshot) {
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
            this.setState({ meal_type: this.props.navigation.state.params.meal_type });
        }.bind(this));
     }
     else {
         await firebase.database().ref('/meals/categories/' + this.props.navigation.state.params.meal_type.toLowerCase() + '/meals').once('value', function(snapshot) {
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
             this.setState({ meal_type: this.props.navigation.state.params.meal_type });
         }.bind(this));
     }
   }
render() {
    if(this.state.meals_data != null) {
        return (
        <View style={styles.mealsScreenContainer}>
          <LinearGradient
              colors={['#ABEBC6', '#2ECC71']}
              style={styles.mealsScreenGradient}
            />
          <GridView
            itemDimension={280}
            style={styles.gridView}
            items={this.state.meals_data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
                <TouchableHighlight style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} onPress={() => {
                            title = item.strMeal;
                            img = item.strMealThumb;
                            location = item.location;
                            strCategory = item.strCategory;
                            cost = item.strCost;
                            calories = item.calories;
                            idMeal = item.idMeal;
                            this.props.navigation.navigate('Meal', {'title': title,
                                                                    'img': img,
                                                                    'cost': cost,
                                                                    'calories':calories,
                                                                    'strCategory': strCategory,
                                                                    'location': location,
                                                                    'idMeal': idMeal});
                    }}>
                <ImageBackground
                  source={{ uri: item.strMealThumb }}
                  imageStyle={{resizeMode: 'cover',borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}

                  style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
                  <View style={[styles.itemContainer]}>
                  {
                     <Text style={{fontFamily: 'Poor Story', textAlign: 'center', width: '100%', fontSize: 28, color: '#fff', backgroundColor: item.code, borderRadius:25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>{item.strMeal}</Text>
                  }
                  </View>
                  </ImageBackground>
              </TouchableHighlight>
            )}
          />
          </View>
        );
    }
    else {
        return null
    }
  }
}
const styles = StyleSheet.create({
    mealsScreenContainer: {
      flex: 1,
    },
    mealsScreenGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: height,
    },
    gridView: {
      paddingTop: 25,
      flex: 1,
    },
    itemContainer: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      flex: 1,
      borderRadius: 25,
      paddingBottom: 0,
      height: 200,
    },

    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },
});
