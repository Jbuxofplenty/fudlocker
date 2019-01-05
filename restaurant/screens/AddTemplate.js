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
import { Font, Camera, Permissions  } from 'expo';
import ParallaxScrollView from 'react-native-parallax-scrollview';
import { RNCamera } from 'react-native-camera';

import { Colors } from '../constants'
const dateformat = require('dateformat');

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

function wp (percentage) {
    const value = (percentage * SCREEN_WIDTH) / 100;
    return Math.round(value);
}

const slideHeight = SCREEN_HEIGHT * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = SCREEN_WIDTH;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

class AddTemplate extends Component {
    static navigationOptions = ({ navigation }) => {
       return {
         title: navigation.getParam('title'),
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
    };
   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });
    var temp = this.props.navigation.state.params;
    this.setState({ fontLoaded: true, paramsLoaded: true });
    }
  randomDate() {
      var date = new Date();
      days_past = Math.random() * (5 - 0) + 0;
      date.setDate(date.getDate()-days_past);
      var d = dateformat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT');
      return d.toString()
  }

  renderDescription = () => {
    return (
        <View>
          <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginBottom: 5, paddingBottom: 5, paddingHorizontal: 5}}>
              <Text style={styles.priceText}>${this.props.navigation.state.params.cost}</Text>
              <Text style={styles.descriptionText}>{this.props.navigation.state.params.title}</Text>
              <View style={styles.lineItemContainer} >
                  <Text style={styles.labelText}>Cuisine Category:</Text>
                  <Text style={styles.valueText}>{this.props.navigation.state.params.strCategory}</Text>
              </View>
              <View style={styles.lineItemContainer} >
                  <Text style={styles.labelText}>Estimated Calories:</Text>
                  <Text style={styles.valueText}>{this.props.navigation.state.params.calories}</Text>
              </View>
              <View style={styles.lineItemContainer} >
                  <Text style={styles.labelText}>Date Packaged:</Text>
                  <Text style={styles.valueText}>{this.randomDate(0,5)}</Text>
              </View>
              <View style={styles.lineItemContainer} >
                <Text style={styles.labelText}>Location:</Text>
                <Text style={styles.valueText}>{this.props.navigation.state.params.location}</Text>
            </View>
          </View>
        </View>
    )
  }
  renderImage = () => {
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
    if (!this.state.fontLoaded || !this.state.paramsLoaded){
            return null
          }
    return (
        <ParallaxScrollView
          windowHeight={SCREEN_HEIGHT * 0.4}
          backgroundSource={{uri: this.props.navigation.state.params.img}}
          navBarView={<View></View>}
          navBarHeight={1}
          navBarColor='transparent'
          headerView={(<TouchableOpacity onPress={() => {navigation.navigate('AddTemplate', {'title': "Add New Template", 'img': "", 'detail': "", 'cost': "", 'calories': "", 'strCategory': "", 'location': "", 'idMeal': ""})}}>
            <Icon
                 name='md-add'
                 type='ionicon'
                 color='white'
                 containerStyle={{backgroundColor: 'transparent', marginLeft: 10}}
              /></TouchableOpacity>)}
          leftIcon={{name: 'rocket', color: 'rgba(193, 193, 193, 1)', size: 30, type: 'font-awesome'}}
          rightIcon={{name: 'user', color: 'rgba(193, 193, 193, 1)', size: 30, type: 'font-awesome'}}
        >
          <ScrollView style={{flex: 1, backgroundColor: 'rgba(228, 117, 125, 1)'}}>
            <View style={{height: 300, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 32, color: 'white'}}>Custom view</Text>
            </View>
            <View style={{height: 300, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 32, color: 'white'}}>keep going.</Text>
            </View>
            <View style={{height: 300, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 32, color: 'white'}}>keep going..</Text>
            </View>
            <View style={{height: 300, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 32, color: 'white'}}>keep going...</Text>
            </View>
            <View style={{height: 300, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 32, color: 'white'}}>the end! :)</Text>
            </View>
          </ScrollView>
        </ParallaxScrollView>
    )
  }
}

export default AddTemplate;

const styles = StyleSheet.create({
cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    height: Dimensions.get('window').width * (3 / 4),
    width: Dimensions.get('window').width,
  },
  lineItemContainer : {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 5,
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
  priceText: {
    marginBottom: 5,
    letterSpacing: 1,
    color: Colors.black,
    fontSize: 36,
    fontWeight: '400',
    fontFamily: 'Poor Story',
    alignSelf: 'center'
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
    alignSelf: 'center',
  },
});
