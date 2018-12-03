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
	ImageBackground,
	ScrollView,
	TouchableOpacity,
	} from 'react-native';

import GridView from 'react-native-super-grid';
import { Icon } from 'react-native-elements';
import { LinearGradient, Font } from 'expo';
import { NavigationActions } from 'react-navigation';
const dateformat = require('dateformat');
import { SelectPayment } from 'react-native-checkout'
import { DrawerActions } from 'react-navigation-drawer';

// json data, will be converted to DB
import location_data from '../assets/static_data/fudlkr_locations.json';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class Inventory extends Component {
    static navigationOptions = ({ navigation }) => {
       return {
          title: 'Inventory',
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
          headerRight: (<TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
            <Icon
                 name='md-menu'
                 type='ionicon'
                 color='white'
                 containerStyle={{backgroundColor: 'transparent', marginRight: 10}}
              /></TouchableOpacity>),
          }
      };
      randomDate(low, high) {
          var date = new Date();
          days_past = Math.random() * (high - low) + low;
          date.setDate(date.getDate()-days_past);
          var d = dateformat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
          return d.toString()
      }
render() {
    return (
    <View style={styles.mealsScreenContainer}>
      <LinearGradient
          colors={['#ABEBC6', '#2ECC71']}
          style={styles.mealsScreenGradient}
        />
      <GridView
        itemDimension={140}
        style={styles.gridView}
        items={location_data.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (
            <TouchableHighlight style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} onPress={() => {
                console.log('hi');
                }}>
              <ImageBackground
                source={{ uri: item.image }}
                imageStyle={{resizeMode: 'cover',borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}

                style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>

                <View style={[styles.itemContainer]}>
                   <Text style={{fontFamily: 'Poor Story', textAlign: 'center', width: '100%', fontSize: 28, color: '#fff', backgroundColor: item.code, borderRadius:25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>{item.title}</Text>
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
    img: {
      width: 30,
      height: 30,
    },
    itemContainer: {
      flexDirection: 'column',
      flex: 1,
      borderRadius: 25,
      paddingBottom: 0,
      height: 200,
    },
    lineItemContainer : {
        flex: 1,
        flexDirection: 'row',
    },
    infoText: {
      fontFamily: 'Poor Story',
      fontSize: 16,
      color: 'black',
      alignSelf: 'center'
    },
    labelText: {
      fontFamily: 'Poor Story',
      fontSize: 12,
      color: 'black',
      width: '50%',
      textAlignVertical: 'center',
      textAlign: 'left',
      paddingLeft: 5,
    },
    valueText: {
      fontFamily: 'Poor Story',
      fontSize: 12,
      width: '50%',
      color: 'black',
      textAlignVertical: 'center',
      textAlign: 'right',
      paddingRight: 5,
    },
    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff',
    },
});
