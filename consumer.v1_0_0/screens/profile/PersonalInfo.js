import React, { Component } from 'react'
import { ScrollView, Switch, StyleSheet, Text, View, Share, WebView, Linking, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import { Font } from 'expo'
import Rate, { AndroidMarket } from 'react-native-rate'
import ToggleSwitch from 'toggle-switch-react-native'

import BaseIcon from './Icon'
import Chevron from './Chevron'
import InfoText from './InfoText'
import FontText from '../FontText'

class PersonalInfo extends Component {
  static navigationOptions = {
        title: 'Personal Information',
        headerStyle: {
          backgroundColor: '#2ECC71',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          textAlign: 'center',
          alignSelf: 'center',
          flex: 1,
        },
        headerRight: (<View></View>),
    };
  state = {
    pushNotifications: true,
    fontLoaded: false,
    mealRadius: 1.5,
  }
  async componentDidMount() {
    await Font.loadAsync({
      'Poor Story': require('../../assets/fonts/PoorStory-Regular.ttf'),
    });
    await Font.loadAsync({
      'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf')
    });
    await Font.loadAsync({
      'Entypo': require('@expo/vector-icons/fonts/Entypo.ttf')
    });
    await Font.loadAsync({
      'FontAwesome': require('@expo/vector-icons/fonts/FontAwesome.ttf')
    });

    this.setState({ fontLoaded: true });
    }

  render() {
    const avatar="http://fudlkr.com/images/josiah_buxton.jpg";
    const name="Josiah Buxton";
    const emails={firstEmail: "josiah.buxton@colorado.edu"};
    const firstEmail={email: "josiah.buxton@colorado.edu"};
    if (this.state.fontLoaded){
    return (
      <View style={styles.container}>
        <Image style={styles.avatar}
            source={{ uri: avatar }}
          />
        <View style={styles.nameContainer}>
            <View style={styles.labelContainer}>
                <Text style={styles.label}>
                    Name
                </Text>
            </View>
            <Text style={styles.name}>
                {name}
            </Text>
        </View>
      </View>
    )}
    else {
        return null
    }
  }
}

export default PersonalInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    width: '50%',
    height: Dimensions.get('window').width/2,
    margin: 10,
  },
  labelContainer: {
      backgroundColor: '#F9F9F9',
      justifyContent: 'flex-start',
      flexDirection: 'row'
    },
  nameContainer: {
    width: '90%',
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 0,
    margin: 10,
    padding: 20
  },
  name: {
    fontFamily: 'Poor Story',
    fontSize: 35,
    textAlignVertical: 'center'
  },
  label: {

    fontFamily: 'Poor Story',
    textAlignVertical: 'center',
    fontSize: 20
  },

});
