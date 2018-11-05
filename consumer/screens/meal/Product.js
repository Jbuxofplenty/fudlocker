import React, { Component } from 'react'
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native'
import PropTypes from 'prop-types'
import { Font } from 'expo'

import PhotoButton from './PhotoButton'
import { Colors } from '../../constants'
const dateformat = require('dateformat');

class Product extends Component {

    state = {
        fontLoaded: false,
        paramsLoaded: false,
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../../assets/fonts/PoorStory-Regular.ttf'),
    });
    var temp = this.props.navigation.state.params;
    this.setState({ fontLoaded: true, paramsLoaded: true });
    }
  renderDetail = () => {
    return (
      <View>
        <Text style={styles.subDetailText}>{this.props.navigation.state.params.detail}</Text>
      </View>
    )
  }
  randomDate() {
      var date = new Date();
      days_past = Math.random() * (5 - 0) + 0;
      date.setDate(date.getDate()-days_past);
      var d = dateformat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
      return d.toString()
  }

  renderDescription = () => {
    if (this.props.navigation.state.params.cost==0){
        return null
    }
    return (
    <View>
        <View>
            <Text style={styles.priceText}>${this.props.navigation.state.params.cost}</Text>
            <Text style={styles.descriptionText}>{this.props.navigation.state.params.title}</Text>
            <Text style={styles.descriptionText}>Date Packaged: {this.randomDate()}</Text>
            <Text style={styles.descriptionText}>Estimated Calories: {this.props.navigation.state.params.calories}</Text>
          </View>
    </View>

    )
  }

  renderNavigator = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity style={[styles.navigatorButton, { flex: 2 }]}
            onPress={() => {
                 this.props.navigation.navigate('Home');
        }}>
          <Text style={styles.descriptionText}>DIRECTIONS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navigatorButton, { flex: 2 }]}
                onPress={() => {
                         this.props.navigation.navigate('Home');
                }}>
          <Text style={styles.descriptionText}>STREET VIEW</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navigatorButton, { flex: 1 }]}
                onPress={() => {
                         this.props.navigation.navigate('Home');
                }}>
          <Text style={styles.descriptionText}>MAP</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderContactHeader = () => {
    const img  = this.props.navigation.state.params.img;
    return (
      <View style={styles.headerContainer}>
        <View style={styles.coverContainer}>
          <ImageBackground
            source={{
              uri: img,
            }}
            style={styles.coverImage}
          >
          </ImageBackground>
        </View>
      </View>
    )
  }

  render() {
    let params = this.props.navigation.state.params;
    if (this.props.navigation.state.params.cost==0){
            return null
          }
    return (

      <View style={styles.mainviewStyle}>
        { params && this.state.fontLoaded ?
        <View style={styles.mainviewStyle}>
        <ScrollView style={styles.scroll}>
          <View style={[styles.container, this.props.containerStyle]}>
          <View style={styles.cardContainer}>
              {this.renderContactHeader()}
          </View>
          </View>

          <View style={styles.productRow}>{this.renderDescription()}</View>
          <View style={styles.productRow}>{this.renderNavigator()}</View>
          <View style={styles.productRow}>{this.renderDetail()}</View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.buttonFooter}>
            <Text style={styles.priceText}>Purchase</Text>
          </TouchableOpacity>
         </View>
        </View>
        : null }
      </View>
    )
  }
}

export default Product;

const styles = StyleSheet.create({
cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
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
    marginBottom: 55,
  },
  productRow: {
    margin: 25,
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
    backgroundColor: '#228B22',
    flexDirection: 'row',
    height: 65,
    alignItems: 'center',
  },
  buttonFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navigatorButton: {
    alignItems: 'flex-start',
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
    marginBottom: 5,
    letterSpacing: 1,
    color: Colors.black,
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
