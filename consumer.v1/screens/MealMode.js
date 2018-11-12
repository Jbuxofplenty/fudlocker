import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button, TouchableHighlight, Image } from 'react-native';
import { LinearGradient, Font } from 'expo';
import GridView from 'react-native-super-grid';
import mealMode_data from '../assets/static_data/meal_modes.json';
import { NavigationActions } from 'react-navigation';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

const { navigation } = '';
const { navigation_params } = '';

export default class MealMode extends Component {
   state = {
    fontLoaded: false,
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
    navigation = this.props.navigation;

    }

  render() {

    return (
    <View style={styles.mealModeScreenContainer}>
      <LinearGradient
                          colors={['#ABEBC6', '#2ECC71']}
                          style={styles.mealModeScreenGradient}
                        />
      <GridView
        itemDimension={260}
        style={styles.gridView}
        items={mealMode_data.meal_categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (
              <TouchableHighlight onPress={() => {
                        if (item.mealMode == "cuisines"){
                            this.props.navigation.navigate('Categories');
                        }
                        else{
                            meal_type = item.mealType;
                            this.props.navigation.navigate('Meals', {'meal_type': meal_type});
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