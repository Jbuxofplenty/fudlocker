import React, { Component } from 'react'
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
} from 'react-native'
import PropTypes from 'prop-types'
import { Font } from 'expo'
import ParallaxScrollView from 'react-native-parallax-scrollview';

import { Colors } from '../constants'
const dateformat = require('dateformat');
const qrcode = require('yaqrcode');

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

class Meal extends Component {
    static navigationOptions = ({ navigation }) => {
       return {
         title: navigation.getParam('strIdMeal'),
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
        paramsLoaded: false,
        idMeal: null,
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });
    this.setState({ fontLoaded: true, paramsLoaded: true, idMeal: this.props.navigation.state.params.idMeal });
    }

  renderDescription = () => {
    let base64 = qrcode(this.state.idMeal);
    if (this.props.navigation.state.params.cost==0){
        return null
    }
    let orderInfo = <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginBottom: 5, paddingBottom: 5, paddingHorizontal: 5}}>
                        <Text style={styles.priceText}>{"Order Information"}</Text>
                        <View style={styles.lineItemContainer} >
                            <Text style={styles.labelText}>Location:</Text>
                            <Text style={styles.valueText}>{this.props.navigation.state.params.location}</Text>
                        </View>
                        <View style={styles.lineItemContainer} >
                            <Text style={styles.labelText}>Meal ID Number:</Text>
                            <Text style={styles.valueText}>{this.props.navigation.state.params.idMeal}</Text>
                        </View>
                        <View style={styles.lineItemContainer} >
                            <Text style={styles.labelText}>Date Purchased:</Text>
                            <Text style={styles.valueText}>{this.props.navigation.state.params.datePurchased}</Text>
                        </View>
                        <View style={styles.lineItemContainer} >
                            <Text style={styles.labelText}>Picked Up:</Text>
                            <Text style={styles.valueText}>{this.props.navigation.state.params.pickedUp ? "true":"false"}</Text>
                        </View>
                    </View>;
    let purchaserInfo = <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginBottom: 5, paddingBottom: 5, paddingHorizontal: 5}}>
                            <Text style={styles.priceText}>{"Purchaser Information"}</Text>
                            <View style={styles.qrCode}>
                                <Image style={{width: 200, height: 200}} source={{uri: this.props.navigation.state.params.headshot}}/>
                            </View>
                            <Text style={styles.nameText}>{this.props.navigation.state.params.name}</Text>
                        </View>;
    return (
    <View>
        <View>
            <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginBottom: 5, paddingBottom: 5, paddingHorizontal: 5}}>
                <Text style={styles.priceText}>{"Meal Information"}</Text>
                <View style={styles.lineItemContainer} >
                    <Text style={styles.labelText}>Meal Title: </Text>
                    <Text style={styles.valueText}>{this.props.navigation.state.params.title}</Text>
                </View>
                <View style={styles.lineItemContainer} >
                    <Text style={styles.labelText}>Cost: </Text>
                    <Text style={styles.valueText}>{this.props.navigation.state.params.cost}</Text>
                </View>
                <View style={styles.lineItemContainer} >
                    <Text style={styles.labelText}>Cuisine Category: </Text>
                    <Text style={styles.valueText}>{this.props.navigation.state.params.strCategory}</Text>
                </View>
                <View style={styles.lineItemContainer} >
                    <Text style={styles.labelText}>Estimated Calories:</Text>
                    <Text style={styles.valueText}>{this.props.navigation.state.params.calories}</Text>
                </View>
                <View style={styles.lineItemContainer} >
                    <Text style={styles.labelText}>Date Packaged:</Text>
                    <Text style={styles.valueText}>{this.props.navigation.state.params.datePackaged}</Text>
                </View>
                <View style={styles.lineItemContainer} >
                    <Text style={styles.labelText}>For Sale:</Text>
                    <Text style={styles.valueText}>{this.props.navigation.state.params.forSale ? "true":"false"}</Text>
                </View>
            </View>
            {!this.props.navigation.state.params.forSale ? orderInfo:null}
            {!this.props.navigation.state.params.forSale ? purchaserInfo:null}
            <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginBottom: 5, paddingBottom: 5, paddingHorizontal: 5, flex: 2}}>
                  <Text style={styles.priceText}>{this.props.navigation.state.params.forSale ? "QR Code of Meal ID":"QR Code of Meal/Order ID"}</Text>
                  <View style={styles.qrCode}>
                    <Image style={{width: 200, height: 200}} source={{uri: base64}}/>
                  </View>
              </View>
          </View>
    </View>

    )
  }

  render() {
    let params = this.props.navigation.state.params;
    if (this.props.navigation.state.params.cost==0 || !params || !this.state.fontLoaded || this.state.idMeal == null){
            return null
          }
    return (
        <View style={styles.mainviewStyle}>
            <ParallaxScrollView
              windowHeight={SCREEN_HEIGHT * 0.4}
              backgroundSource={{uri: this.props.navigation.state.params.img}}
              navBarView={<View></View>}
              navBarHeight={1}
              navBarColor='transparent'
              headerView={(<View/>)}
            >
            <View style={styles.productRow}>{this.renderDescription()}</View>
            </ParallaxScrollView>
        </View>
    )
  }
}

export default Meal;

const styles = StyleSheet.create({
cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  lineItemContainer : {
      flex: 1,
      flexDirection: 'row',
      marginVertical: 5,
  },
  qrCode : {
    alignSelf: 'center',
},
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    height: Dimensions.get('window').width * (3 / 4),
    width: Dimensions.get('window').width,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  scroll: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  productRow: {
    margin: 15,
  },
  mainviewStyle: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'column',
  },
  coverMetaContainer: {
    alignItems: 'flex-end',
    flex: 1,
    justifyContent: 'flex-end',
    // marginBottom: 15,
    // marginRight: 15,
  },
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#2ECC71',
    flexDirection: 'row',
    height: 65,
    alignItems: 'center',
  },
  labelText: {
    fontFamily: 'Poor Story',
    fontSize: 18,
    color: 'black',
    width: '50%',
    textAlignVertical: 'center',
    textAlign: 'left',
    paddingLeft: 5,
  },
  location: {
      fontFamily: 'Poor Story',
      fontSize: 24,
      color: 'black',
      width: '100%',
      textAlignVertical: 'center',
      textAlign: 'center',
    },
  valueText: {
    fontFamily: 'Poor Story',
    fontSize: 18,
    width: '50%',
    color: 'black',
    textAlignVertical: 'center',
    textAlign: 'right',
    paddingRight: 5,
  },
  nameText: {
      fontFamily: 'Poor Story',
      fontSize: 22,
      width: '50%',
      color: 'black',
      textAlignVertical: 'center',
      textAlign: 'center',
      marginVertical: 15,
      alignSelf: 'center',
 },
  buttonFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navigatorButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  borderCenter: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#FFA890',
  },
  textFooter: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
    fontFamily: 'Poor Story',
  },
  priceText: {
    marginVertical: 10,
    letterSpacing: 1,
    color: Colors.black,
    fontSize: 28,
    fontWeight: '400',
    fontFamily: 'Poor Story',
    alignSelf: 'center',
  },
  buttonText: {
      marginBottom: 5,
      letterSpacing: 1,
      color: 'white',
      fontSize: 36,
      fontWeight: '400',
      fontFamily: 'Poor Story',
    },
  detailText: {
    marginBottom: 4,
    color: Colors.black,
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: 'Poor Story',
  },
  subDetailText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: '100',
    lineHeight: 28,
    letterSpacing: 0.5,
    fontFamily: 'Poor Story',
  },
  descriptionText: {
    marginBottom: 4,
    color: Colors.gray,
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1,
    fontFamily: 'Poor Story',
  },
});
