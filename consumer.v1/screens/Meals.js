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

// json data, will be converted to DB
import asian_data from '../assets/dynamic_data/meals_asian.json';
import mexican_data from '../assets/dynamic_data/meals_mexican.json';
import american_data from '../assets/dynamic_data/meals_american.json';
import salad_data from '../assets/dynamic_data/meals_salads.json';
import apps_data from '../assets/dynamic_data/meals_apps.json';
import italian_data from '../assets/dynamic_data/meals_italian.json';
import meat_data from '../assets/dynamic_data/meals_meat.json';

import farrand_data from '../assets/dynamic_data/meals_farrand.json';
import c4c_data from '../assets/dynamic_data/meals_c4c.json';
import village_data from '../assets/dynamic_data/meals_village.json';
import all_data from '../assets/dynamic_data/all_meals.json';


const meal_data = {
    'Asian': asian_data.meals,
    'Mexican': mexican_data.meals,
    'American': american_data.meals,
    'Salads': salad_data.meals,
    'Appetizers': apps_data.meals,
    'Italian': italian_data.meals,
    'Meat': meat_data.meals,
    'Farrand': farrand_data.meals,
    'C4C': c4c_data.meals,
    'Village': village_data.meals,
    'All': all_data.meals,
}

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class Meals extends Component {
    static navigationOptions = ({ navigation }) => {
       return {
         title: navigation.getParam('meal_type'),
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

render() {
    return (
    <View style={styles.mealsScreenContainer}>
      <LinearGradient
                          colors={['#ABEBC6', '#2ECC71']}
                          style={styles.mealsScreenGradient}
                        />
      <GridView
        itemDimension={280}
        style={styles.gridView}
        items={meal_data[this.props.navigation.state.params.meal_type]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (

            <TouchableHighlight style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} onPress={() => {
        			    title = item.strMeal;
        			    img = item.strMealThumb;
        			    location = item.location;
        			    strCategory = item.strCategory;
        			    cost = item.strCost;
        			    calories = item.calories;
        			    desc = item.desc;
        			    this.props.navigation.navigate('Meal', {'title': title, 'img': img, 'detail': desc, 'cost': cost, 'calories':calories, 'strCategory': strCategory, 'location': location});
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
