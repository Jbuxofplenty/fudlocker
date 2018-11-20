import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button, TouchableHighlight, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo';
import GridView from 'react-native-super-grid';
import category_data from '../assets/static_data/meal_categories.json';
import { Font } from 'expo';
import { NavigationActions } from 'react-navigation';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class Categories extends Component {
   state = {
    fontLoaded: false,
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });
    }

  render() {

    return (
    <View style={styles.categoriesScreenContainer}>
      <LinearGradient
                          colors={['#ABEBC6', '#2ECC71']}
                          style={styles.categoriesScreenGradient}
                        />
      <GridView
        itemDimension={140}
        style={styles.gridView}
        items={category_data.meal_categories}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (

            <TouchableHighlight style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} onPress={() => {
                meal_type = item.strCategory;
                this.props.navigation.navigate('Meals', {'meal_type': meal_type});
                }}>
            <ImageBackground
              source={{ uri: item.strCategoryThumb }}
              imageStyle={{resizeMode: 'cover',borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}

              style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>

              <View style={[styles.itemContainer]}>
              {
                  this.state.fontLoaded ? (
                     <Text style={{fontFamily: 'Poor Story', textAlign: 'center', width: '100%', fontSize: 28, color: '#fff', backgroundColor: item.code, borderRadius:25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>{item.strCategory}</Text>
                 ) : null
              }
              </View>
              </ImageBackground>
          </TouchableHighlight>
        )}
      />
      </View>

    );
  }
}
const styles = StyleSheet.create({
    categoriesScreenContainer: {
      flex: 1,
    },
    categoriesScreenGradient: {
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
      height: 140,
    },

    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },
});