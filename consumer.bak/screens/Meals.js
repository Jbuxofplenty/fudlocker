import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	Linking,
	Image,
	ActivityIndicator } from 'react-native';

import { NavigationActions } from 'react-navigation';

import MealScreen from './meal/Product';

// json data, will be converted to DB
import asian_data from '../assets/dynamic_data/meals_asian.json';
import mexican_data from '../assets/dynamic_data/meals_mexican.json';

const meal_data = {
    'Asian': asian_data.meals,
    'Mexican': mexican_data.meals,
}

export default class Recipe extends Component {
  render() {
  	return (
      <View style={{flex: 1, paddingTop:20}}>
		<FlatList
        	data={meal_data[this.props.navigation.state.params.meal_type]}
        	keyExtractor={(item, index) => index.toString()}
        	renderItem={({item}) => <View key={item.idCategory}>
	        	<Image
	              style={{width: '100%', height: 250}}
	              source={{uri: item.strCategoryThumb}}
	            />
        		<Text
        			style={styles.title}
        			onPress={() => {
        			    title = item.strCategory;
        			    img = item.strCategoryThumb;
        			    data_location = item.strSourceData;
        			    this.props.navigation.navigate('Meal', {'title': title, img: img, detail: 'none', 'data_location': data_location});
        			}}
        		>
        			{item.strCategory}
        		</Text>
        	</View>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicator: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 80
  },
  title: {
  	textAlign: 'center',
  	fontSize: 20,
  	height: 35,
  	marginBottom: 10
  }
});