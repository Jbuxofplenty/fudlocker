import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button, TouchableHighlight, Image } from 'react-native';
import { LinearGradient, Font } from 'expo';
import GridView from 'react-native-super-grid';
import { NavigationActions } from 'react-navigation';
import * as firebase from 'firebase';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class MealMode extends Component {
   static navigationOptions = {
         title: 'Meal Mode',
         headerStyle: {
           backgroundColor: '#2ECC71',
         },
         headerTintColor: '#fff',
         headerTitleStyle: {
           textAlign: 'center',
           alignSelf: 'center',
           flex: 1,
         },
         headerLeft: (<View></View>),
     };
   state = {
    fontLoaded: false,
    mealMode_data: null,
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
    this.populateInfo();
   }
   populateInfo() {
     //Get the current userID
     var userId = firebase.auth().currentUser.uid;
     //Get the user data
     return firebase.database().ref('/static/mealModes').once('value').then(function(snapshot) {
         this.setState({ mealMode_data: snapshot.val().meal_categories });
     }.bind(this));
   }
  render() {
    if(this.state.mealMode_data != null) {
        return (
        <View style={styles.mealModeScreenContainer}>
          <LinearGradient
              colors={['#ABEBC6', '#2ECC71']}
              style={styles.mealModeScreenGradient}
            />
          <GridView
            itemDimension={260}
            style={styles.gridView}
            items={this.state.mealMode_data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
                  <TouchableHighlight onPress={() => {
                            if (item.mealMode == "cuisines"){
                                this.props.navigation.navigate('Categories');
                            }
                            else{
                                meal_type = item.mealType;
                                strCategory = item.strCategory;
                                this.props.navigation.navigate('Meals', {'meal_type': meal_type, 'title': strCategory});
                            }
                      }}>
                      <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
                        {
                          this.state.fontLoaded ? (
                             <Text style={{fontFamily: 'Poor Story', fontSize: 28, color: '#fff'}}>{item.strCategory}</Text>
                         ) : null
                        }
                      </View>
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
    mealModeScreenContainer: {
      flex: 1,
    },
    mealModeScreenGradient: {
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
      justifyContent: 'center',
      borderRadius: 15,
      padding: 10,
      height: 250,
      zIndex: 10,
    },
    itemName: {
      fontFamily: 'Poor Story',
      fontSize: 24,
      color: '#fff',
      fontWeight: '600',
    },
    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },
});