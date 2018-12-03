import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Button, TouchableHighlight, Image } from 'react-native';
import { LinearGradient, Font } from 'expo';
import GridView from 'react-native-super-grid';
import orderMode_data from '../assets/static_data/order_modes.json';
import { NavigationActions } from 'react-navigation';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class OrderMode extends Component {
   static navigationOptions = {
         title: 'Order Mode',
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
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });

    this.setState({ fontLoaded: true });

    }

  render() {

    return (
    <View style={styles.orderModeScreenContainer}>
      <LinearGradient
          colors={['#ABEBC6', '#2ECC71']}
          style={styles.orderModeScreenGradient}
        />
      <GridView
        itemDimension={260}
        style={styles.gridView}
        items={orderMode_data.order_modes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={item => (
              <TouchableHighlight onPress={() => {
                if (item.mode == "Current"){
                    this.props.navigation.navigate('Orders', {meal_type: item.mode, title: item.strOrderMode});
                }
                else{
                    this.props.navigation.navigate('Orders', {meal_type: item.mode, title: item.strOrderMode});
                }
              }}>
              <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
                  {
                      this.state.fontLoaded ? (
                         <Text style={{fontFamily: 'Poor Story', fontSize: 28, color: '#fff'}}>{item.strOrderMode}</Text>
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
    orderModeScreenContainer: {
      flex: 1,
    },
    orderModeScreenGradient: {
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