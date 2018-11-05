import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { LinearGradient } from 'expo';
import GridView from 'react-native-super-grid';
import category_data from '../assets/static_data/meal_modes.json';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class MealMode extends Component {
  render() {

    return (
    <View style={styles.loginScreenContainer}>
      <LinearGradient
                          colors={['#ABEBC6', '#2ECC71']}
                          style={styles.loginScreenGradient}
                        />
      <GridView
        itemDimension={260}
        style={styles.gridView}
        items={category_data.meal_categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (
          <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
            <Text style={styles.itemName}>{item.strCategory}</Text>
          </View>
        )}
      />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  loginScreenContainer: {
    flex: 1,
  },
  loginScreenGradient: {
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
    borderRadius: 5,
    padding: 10,
    height: 250,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});