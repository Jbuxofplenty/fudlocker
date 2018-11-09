import React, { Component } from 'react'
import { ScrollView, Switch, StyleSheet, Text, View } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import { WebView, Linking } from 'react-native'
import { Font } from 'expo'

import BaseIcon from './Icon'
import Chevron from './Chevron'
import InfoText from './InfoText'
import FontText from '../FontText'

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 6,
  },
  userImage: {
    marginRight: 12,
  },
  listItemContainer: {
    height: 55,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
})

class SettingsScreen extends Component {

  state = {
    pushNotifications: true,
    fontLoaded: false,
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
  onPressOptions = () => {
    this.props.navigation.navigate('options')
  }

  onChangePushNotifications = () => {
    this.setState(state => ({
      pushNotifications: !state.pushNotifications,
    }))
  }
  openURI(uri){
    this.props.navigation.navigate('WebView', {uri:uri})
  }

  render() {
    const avatar="http://fudlkr.com/images/josiah_buxton.jpg";
    const name="Josiah Buxton";
    const emails={firstEmail: "josiah.buxton@colorado.edu"};
    const firstEmail={email: "josiah.buxton@colorado.edu"};
    if (this.state.fontLoaded){
    return (
      <ScrollView style={styles.scroll}>
        <View style={styles.userRow}>
          <View style={styles.userImage}>
            <Avatar
              rounded
              size="large"
              source={{
                uri: avatar,
              }}
            />
          </View>
          <View>
            <Text style={{ fontFamily: 'Poor Story', fontSize: 16 }}>{name}</Text>
                        <Text
                          style={{
                            color: 'gray',
                            fontSize: 16,
                            fontFamily: 'Poor Story',
                          }}
                        >
                          {firstEmail.email}
                        </Text>
           </View>
        </View>
        <InfoText text="Account" />
        <View>
          <ListItem
            hideChevron
            title="Push Notifications"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            containerStyle={styles.listItemContainer}
            rightElement={
              <Switch
                onValueChange={this.onChangePushNotifications}
                value={this.state.pushNotifications}
              />
            }
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#FFADF2',
                }}
                icon={{
                  type: 'material',
                  name: 'notifications',
                }}
              />
            }
          />
          <ListItem
            // chevron
            title="Meal Radius"
            rightTitle="1.5 miles"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15 }}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FAD291' }}
                icon={{
                  type: 'ionicon',
                  name: 'md-locate',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Payment Information"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15 }}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#57DCE7' }}
                icon={{
                  type: 'font-awesome',
                  name: 'money',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Language"
            rightTitle="English"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            rightTitleStyle={{ fontFamily: 'Poor Story', fontSize: 15, marginRight: 15 }}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#FEA8A1' }}
                icon={{
                  type: 'material',
                  name: 'language',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
        <InfoText text="More" />
        <View>
          <ListItem
            title="About Us"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.openURI("http://fudlkr.com")}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#A4C8F0' }}
                icon={{
                  type: 'ionicon',
                  name: 'md-information-circle',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Terms and Policies"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{ backgroundColor: '#C6C7C6' }}
                icon={{
                  type: 'entypo',
                  name: 'light-bulb',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Share our App"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#C47EFF',
                }}
                icon={{
                  type: 'entypo',
                  name: 'share',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Rate Us"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.onPressOptions()}
            containerStyle={styles.listItemContainer}
            badge={{
              value: 5,
              textStyle: { color: 'white', fontFamily: 'Poor Story', fontSize: 16 },
              containerStyle: { backgroundColor: 'gray', marginTop: 0, marginRight: 15 },
            }}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#FECE44',
                }}
                icon={{
                  type: 'entypo',
                  name: 'star',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
          <ListItem
            title="Send FeedBack"
            titleStyle={{fontFamily: 'Poor Story', fontSize: 16}}
            onPress={() => this.openURI("http://fudlkr.com/signup.html")}
            containerStyle={styles.listItemContainer}
            leftIcon={
              <BaseIcon
                containerStyle={{
                  backgroundColor: '#00C001',
                }}
                icon={{
                  type: 'materialicon',
                  name: 'feedback',
                }}
              />
            }
            rightIcon={<Chevron />}
          />
        </View>
      </ScrollView>
    )}
    else {
        return null
    }
  }
}

export default SettingsScreen
