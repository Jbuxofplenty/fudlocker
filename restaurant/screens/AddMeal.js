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
import { DrawerActions } from 'react-navigation-drawer';
import * as firebase from 'firebase';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;

export default class AddMeal extends Component {
    static navigationOptions = ({ navigation }) => {
       return {
          title: 'Add Meal',
          headerStyle: {
            backgroundColor: '#2ECC71',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
            flex: 1,
          },
          headerLeft: (<TouchableOpacity onPress={() => {navigation.navigate('AddTemplate', {
                                                  'title': "Add New Template",
                                                  'img': "https://s3-us-west-1.amazonaws.com/fudlkr.com/mobile_assets/green.png",
                                                  'detail': "",
                                                  'cost': "",
                                                  'calories': "",
                                                  'strCategory': "",
                                                  'location': "",
                                                  'idMeal': "",
                                                  'shelfLife': "",
                                                  'templateData': {"strMealThumb": "https://s3-us-west-1.amazonaws.com/fudlkr.com/mobile_assets/green.png"}})}}>
                      <Icon
                           name='md-add'
                           type='ionicon'
                           color='white'
                           containerStyle={{backgroundColor: 'transparent', marginLeft: 10}}
                        /></TouchableOpacity>),
          headerRight: (<TouchableOpacity onPress={() => {navigation.dispatch(DrawerActions.openDrawer())}}>
            <Icon
                 name='md-menu'
                 type='ionicon'
                 color='white'
                 containerStyle={{backgroundColor: 'transparent', marginRight: 10}}
              /></TouchableOpacity>),
          }
      };
      state = {
          fontLoaded: false,
          paramsLoaded: false,
          templateData: null,
          name: null,
          email: null,
          phone: null,
          org: null,
      };
      async componentDidMount() {
          await Font.loadAsync({
              'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
          });
          var temp = this.props.navigation.state.params;
          this.setState({ fontLoaded: true, paramsLoaded: true });
          this.populateInfo();
      }

      async populateInfo() {
        //Get the current userID
        var userId = firebase.auth().currentUser.uid;
        //Get the user data
        await firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
              this.setState({ name: snapshot.val().name });
              this.setState({ email: snapshot.val().email });
              this.setState({ phone: snapshot.val().phone });
              this.setState({ org: snapshot.val().org });
              if(snapshot.val().org){
                this.populateAddMeal(snapshot.val().org);
              }
              else {
                this.setState({ templateData: []});
              }
          }.bind(this));
     }
     async populateAddMeal(org) {
        var userId = firebase.auth().currentUser.uid;
        return firebase.database().ref('/restaurants/' + org + '/templates/default/').once('value').then(function(snapshot) {
           let tempArray = [];
           snapshot.forEach(function(childSnapshot) {
             var childData = childSnapshot.val();
             tempArray.push(childData);
           });
           this.setState({ templateData: tempArray });
        }.bind(this));
     }
render() {
    if(this.state.templateData != null ) {
        return (
        <View style={styles.mealsScreenContainer}>
          <LinearGradient
              colors={['#ABEBC6', '#2ECC71']}
              style={styles.mealsScreenGradient}
            />
          <GridView
            itemDimension={140}
            style={styles.gridView}
            items={this.state.templateData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={item => (
                <TouchableHighlight style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}} onPress={() => {
                    this.props.navigation.navigate('AddTemplate', {
                        'title': item.strTemplate,
                        'img': item.strTemplateThumb,
                        'cost': item.strCost,
                        'calories': item.calories,
                        'strCategory': item.strCategory,
                        'location': item.location,
                        'shelfLife': item.shelfLife,
                        'templateData': item,
                        });
                    }}>
                  <ImageBackground
                    source={{ uri: item.strTemplateThumb }}
                    imageStyle={{resizeMode: 'cover',borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}
                    style={{borderRadius: 25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}>
                    <View style={[styles.itemContainer]}>
                       <Text style={{fontFamily: 'Poor Story', textAlign: 'center', width: '100%', fontSize: 28, color: '#fff', backgroundColor: item.code, borderRadius:25, borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}>{item.strTemplate}</Text>
                    </View>
                  </ImageBackground>
              </TouchableHighlight>
            )}
          />
          </View>
        );
    }
    else {
        return null;
    }
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
