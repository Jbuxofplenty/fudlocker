import React, { Component } from 'react'
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Picker,
  Button,
  Modal,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Font } from 'expo';
import { Header } from 'react-navigation';
import ParallaxScrollView from 'react-native-parallax-scrollview';
import * as firebase from 'firebase';

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
        tempPicture: null,
        backgroundImage: null,
        templateTitle: null,
        mealTitle: null,
        category: null,
        calories: null,
        location: null,
        cost: null,
        pictureUndo: false,
        shelfLife: null,
        org: null,
        locations: null,
        locationsData: null,
        buttonTitle: null,
        modalVisible: false,
        modalMessage: "",
        allTemplateData: null,
        modalTitle: "Error!",
        modalButton: "    OK    ",
        modalType: "error",
        mealData: null,
        imageUrl: null,
        templateData: null,
        initialPicURI: null,
    };

   async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });
    var temp = this.props.navigation.state.params;
    this.setState({ fontLoaded: true, paramsLoaded: true });
    this.populateInfo();
  }

  returnData(tempPic) {
    this.setState({ tempPicture: this.state.backgroundImage });
    this.setState({ backgroundImage: tempPic.uri, pictureUndo: true });
  }

  async populateInfo() {
    if(this.state.tempPicture == null){
       this.setState({ backgroundImage: this.props.navigation.state.params.img });
    }
    else{
       this.setState({ backgroundImage: this.state.tempPicture });
    }
    if(String(this.props.navigation.state.params.cost) == ""){
        this.setState({ buttonTitle: "Add New Template" });
    }
    else {
        this.setState({ buttonTitle: "Add Meal to Locker" });
    }
    this.setState({ cost: String(this.props.navigation.state.params.cost),
                    templateTitle: this.props.navigation.state.params.title,
                    mealTitle: this.props.navigation.state.params.title,
                    category: this.props.navigation.state.params.strCategory,
                    calories: String(this.props.navigation.state.params.calories),
                    location: this.props.navigation.state.params.location,
                    shelfLife: String(this.props.navigation.state.params.shelfLife),
                    templateData: this.props.navigation.state.params.templateData,
                    initialPicURI: this.props.navigation.state.params.templateData.strTemplateThumb,
                  });

     var userId = firebase.auth().currentUser.uid;
     await firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
          this.setState({ org: snapshot.val().org });
          if(snapshot.val().org){
            this.populateLocations(snapshot.val().org);
          }
          else {
            this.setState({ locations: []});
          }
      }.bind(this));
      await firebase.database().ref('/restaurants/' + this.state.org + '/idRestaurant').once('value').then(function(snapshot) {
          this.setState({idOrg: snapshot.val()});
      }.bind(this));
  }

  async populateLocations(org) {
      var userId = firebase.auth().currentUser.uid;
      return firebase.database().ref('/restaurants/' + org + '/lockers/').once('value').then(function(snapshot) {
         let tempArray = snapshot.val()["data"];
         var locationsData = {};
         for(var item in tempArray) {
            locationsData[tempArray[item].type] = tempArray[item];
         }
         this.setState({ locations: tempArray, locationsData });
      }.bind(this));
  }

  async addNew () {
    // verify all of the data inputted correctly
    if(!this.verifyCost()){
        this.setState({modalMessage: "Cost entered incorrectly.  Enter a number between $0 and $50.", modalVisible: true, cost: ""});
        return;
    }
    if(!this.verifyCalories()){
        this.setState({modalMessage: "Calories entered incorrectly.  Enter a number between 0 and 2000.", modalVisible: true, calories: ""});
        return;
    }

    //retrieve data from db to look for duplicates
    var userId = firebase.auth().currentUser.uid;
    await firebase.database().ref('/restaurants/' + this.state.org + '/templates/default/').once('value').then(function(snapshot) {
       let tempArray = [];
       snapshot.forEach(function(childSnapshot) {
         var childData = childSnapshot.val();
         tempArray.push(childData);
       });
       this.setState({ allTemplateData: tempArray });
    }.bind(this));
    //check to see if this is a unique template
    var unique = true;
    var item = null;
    for (index = 0; index < this.state.allTemplateData.length; index++) {
        if(unique) {
            item = this.state.allTemplateData[index];
            if(item.strCost == this.state.cost && item.strTemplate == this.state.templateTitle && item.strCategory == this.state.category && item.location == this.state.location && item.shelfLife == this.state.shelfLife){
                unique = false;
            }
        }
    }
    // show modal to confirm
    if(unique) {
       this.setState({modalVisible: true, modalTitle: "New Template Confirmation",
                      modalMessage: "We noticed the template you created is unique.  Would you like to save this template so you can access it later?",
                      modalButton: "   Confirm!   ",
                      modalType: "template"})
    }
    else {
       this.setState({modalVisible: true,
       modalTitle: "New Meal Confirmation",
       modalMessage: "Verify the information below and click on the confirm button to generate a new meal to be stored in the locker." +
                     "\n\nMeal Title:\t\t" + this.state.mealTitle +
                     "\nCost:\t\t$" + this.state.cost +
                     "\nCategory:\t\t" + this.state.category +
                     "\nCalories:\t\t" + this.state.calories +
                     "\nShelf Life:\t\t" + this.state.shelfLife +
                     "\nLocation:\t\t" + this.state.location.toLowerCase(),
       modalButton: "   Confirm!   ",
       modalType: "meal"});
    }
  }
  async formatData() {
    // format data to send to firebase
    var userId = firebase.auth().currentUser.uid;
    mealData = {}
    mealData["calories"] = this.state.calories;
    mealData["code"] = 'rgb(' + Math.floor(Math.random()*255).toString() + ', ' + Math.floor(Math.random()*255).toString() + ', ' + Math.floor(Math.random()*255).toString() + ')';
    mealData["shelfLife"] = this.state.shelfLife;
    mealData["distributor"] = this.state.org;
    mealData["forSale"] = true;
    mealData["location"] = this.state.location;
    mealData["netWeight"] = 4.21;
    mealData["strCategory"] = this.state.category;
    mealData["strCost"] = "" + this.state.cost;
    mealData["strTemplate"] = this.state.templateTitle;
    mealData["strTemplateThumb"] = this.state.backgroundImage;
    await this.setState({ mealData });
  }

  async addNewTemplate () {
    await this.setState({modalVisible: false});
    this.setState({modalVisible: true,
                   modalType: 'loading',
                   modalTitle: "Loading...",
                   modalMessage: "",
                   });
    await this.formatData();
    var mealData = this.state.mealData;
    await firebase.database().ref('/restaurants/' + this.state.org + '/templateCounter').once('value').then(function(snapshot) {
        mealData["idTemplate"] = snapshot.val();
    }.bind(this));
    await firebase.database().ref('/restaurants/' + this.state.org + '/').update({
      templateCounter: mealData.idTemplate + 1
    });
    // first 1 represents template rather than meal
    mealData["idTemplate"] = "1"+this.state.idOrg + "" + mealData["idTemplate"]
    if(this.state.initialPicURI != this.state.backgroundImage) {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(xhr.response);
            };
            xhr.onerror = function(e) {
              console.log(e);
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', this.state.backgroundImage, true);
            xhr.send(null);
          });
        var picRef = firebase.storage().ref('/meals/').child(mealData["idTemplate"] + '.jpeg ');
        await picRef.put(blob).then(function(snapshot) {});
        await picRef.getDownloadURL().then(function(url) {
          this.setState({imageUrl: url})
        }.bind(this));
        mealData["strTemplateThumb"] = this.state.imageUrl;
    }
    else {
        mealData["strTemplateThumb"] = this.state.initialPicURI;
    }
    //Get the current userID
    var userId = firebase.auth().currentUser.uid;
    await firebase.database().ref('/restaurants/' + this.state.org + '/templates/default/' + mealData["idTemplate"] + "/").update(mealData);
    this.setState({modalVisible: true,
                   modalTitle: "New Meal Confirmation",
                   modalMessage: "Verify the information below and click on the confirm button to generate a new meal to be stored in the locker." +
                                 "\n\nMeal Title:\t\t" + this.state.mealTitle +
                                 "\nCost:\t\t$" + this.state.cost +
                                 "\nCategory:\t\t" + this.state.category +
                                 "\nCalories:\t\t" + this.state.calories +
                                 "\nShelf Life:\t\t" + this.state.shelfLife +
                                 "\nLocation:\t\t" + this.state.location,
                   modalButton: "   Confirm!   ",
                   modalType: "meal",
                   mealData: mealData});

  }

  async addNewMeal () {
    await this.setState({modalVisible: false});
    var userId = firebase.auth().currentUser.uid;
    this.setState({modalVisible: true,
         modalType: 'loading',
         modalTitle: "Loading...",
         modalMessage: "",
    });
    mealData = this.state.mealData;
    if(mealData == null) {
        await this.formatData();
        mealData = this.state.mealData;
    }
    //check to see if there is space in the locker
    var locker = null;
    var totalMeals = 0;
    for(var meal in this.state.locationsData[this.state.mealData.location].lockers) {
        if(this.state.locationsData[this.state.mealData.location].lockers[meal]) {
            totalMeals += 1;
        }
    }
    if (totalMeals >= this.state.locationsData[this.state.mealData.location].capacity) {
        this.setState({modalMessage: "No space available in the specified locker!", modalType: "error", modalTitle: "Error!", modalVisible: true });
        return;
    }
    else {
        for (var lock in this.state.locationsData[this.state.mealData.location].lockers) {
            if (!this.state.locationsData[this.state.mealData.location].lockers[lock]) {
                locker = lock;
                break;
            }
        }
    }
    mealData["locker"] = locker;
    var date = Date.now();
    var d = dateformat(date, 'dddd, mmmm d, yyyy, h:MM:ss TT');
    mealData["strDatePackaged"] = d.toString();
    mealData["datePackaged"] = date.toString();
    await firebase.database().ref('/restaurants/' + this.state.org + '/mealCounter').once('value').then(function(snapshot) {
        mealData["idMeal"] = snapshot.val();
    }.bind(this));
    await firebase.database().ref('/restaurants/' + this.state.org + '/').update({
      mealCounter: mealData.idMeal + 1
    });
    mealData["idMeal"] = "0" + this.state.idOrg + "" + mealData["idMeal"];
    mealData["strIdMeal"] = "Meal ID #" + mealData["idMeal"];
    mealData["strMeal"] = this.state.mealTitle;
    mealData["forSale"] = true;
    if(this.state.initialPicURI != this.state.backgroundImage) {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
              resolve(xhr.response);
            };
            xhr.onerror = function(e) {
              console.log(e);
              reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', this.state.backgroundImage, true);
            xhr.send(null);
          });
        if(this.state.imageUrl == null) {
            var picRef = firebase.storage().ref('/meals/').child(mealData["idMeal"] + '.jpeg ');
            await picRef.put(blob).then(function(snapshot) {});
            await picRef.getDownloadURL().then(function(url) {
              this.setState({imageUrl: url})
            }.bind(this));
            mealData["strMealThumb"] = this.state.imageUrl;
        }
    }
    else {
        mealData["strMealThumb"] = this.state.initialPicURI;
    }

    // upload data to firebase
    await firebase.database().ref('/meals/all/meals/'+this.state.mealData["idMeal"]+'/').push(mealData);
    await firebase.database().ref('/meals/categories/'+mealData['strCategory'].toLowerCase()+'/meals/'+this.state.mealData["idMeal"]+'/').push(mealData);
    await firebase.database().ref('/meals/locations/'+mealData['location'].toLowerCase()+'/meals/'+this.state.mealData["idMeal"]+'/').push(mealData);
    await firebase.database().ref('/restaurants/'+mealData['distributor'].toLowerCase()+'/meals/history/'+this.state.mealData["location"].toLowerCase()+'/'+this.state.mealData["idMeal"]+'/').push(mealData);
    var individualLocker = {};
    individualLocker[mealData.locker] = true;
    await firebase.database().ref('/restaurants/' + mealData['distributor'].toLowerCase() + '/lockers/data/' + this.state.locationsData[this.state.mealData.location].id + '/lockers/').update(individualLocker);
    var forSale = {};
    forSale[mealData.idMeal] = true;
    await firebase.database().ref('/meals/forSale/').update(forSale);

    await this.setState({modalVisible: false, modalType: "error", mealData: mealData});
    this.props.navigation.navigate('Meal', {'title': this.state.mealData['strMeal'],
     'img': this.state.mealData['strMealThumb'],
     'cost': this.state.mealData['strCost'],
     'calories': this.state.mealData['calories'],
     'strCategory': this.state.mealData['strCategory'],
     'location': this.state.mealData['location'],
     'forSale': this.state.mealData['forSale'],
     'idMeal': this.state.mealData['strIdMeal'],
     'strIdMeal': this.state.mealData['strIdMeal'],
     'shelfLife': this.state.mealData['shelfLife'],
     'datePackaged': this.state.mealData['strDatePackaged'],
     'datePurchased': this.state.mealData['strDatePurchased'],
     'pickedUp': this.state.mealData['pickedUp']});
    return;
  }

  verifyCost() {
    var verified = true;
    try {
      var cost = parseFloat(this.state.cost, 10);
      if(cost < 0 || cost > 50 || isNaN(cost)){
        verified=false
      }
    }
    catch(err) {
      verified = false;
    }
    if(!verified){this.setState({modalType: "error"})};
    return verified;
  }

  verifyCalories() {
    var verified = true;
    try {
        var calories = parseInt(this.state.calories, 10);
        if(calories < 0 || calories > 2000 || isNaN(calories)){
            verified=false;
        }
    }
    catch(err) {
        verified = false;
    }
    if(!verified){this.setState({modalType: "error"})};
    return verified;
  }

  closeModal = () => {
     this.setState({ modalVisible: false });
  };

  renderDescription = () => {
    return (
        <ScrollView style={{flex: 1}}>
          <View style={{backgroundColor: '#F9F9F9', borderRadius: 10, marginVertical: 5, paddingBottom: 5, paddingHorizontal: 5, width: '95%', alignSelf: "center"}}>
              <Text style={styles.priceText}>{"Meal Information"}</Text>
              <View style={styles.lineItemContainer} >
                    <Text style={styles.labelText}>Template Title:</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize={'words'}
                        onChangeText={(templateTitle) => this.setState({templateTitle})}
                        value={this.state.templateTitle}
                   />
              </View>
              <View style={styles.lineItemContainer} >
                    <Text style={styles.labelText}>Meal Title:</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize={'words'}
                        onChangeText={(mealTitle) => this.setState({mealTitle})}
                        value={this.state.mealTitle}
                   />
              </View>
              <View style={styles.lineItemContainer} >
                    <Text style={styles.labelText}>Cost ($):</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(cost) => {this.setState({cost})}}
                        onEndEditing={() => {
                            if(this.verifyCost()){
                                var temp = (parseFloat(this.state.cost, 10)).toFixed(2);
                                this.setState({cost: temp})
                            } else {
                                this.setState({modalMessage: "Cost entered incorrectly.  Enter a number between $0 and $50.", modalVisible: true, cost: ""});}
                            }}
                        value={this.state.cost}
                    />
              </View>
              <View style={styles.lineItemContainer} >
                  <Text style={styles.labelText}>Cuisine Category:</Text>
                   <Picker
                        selectedValue={this.state.category.toLowerCase()}
                        style={{width: '50%', backgroundColor: 'white', height: 30}}
                        itemStyle={styles.pickerItem}
                        onValueChange={(category) => this.setState({category})}
                        mode={'dropdown'}>
                        <Picker.Item label="Asian" value="asian" />
                        <Picker.Item label="American" value="american" />
                        <Picker.Item label="Appetizers" value="apps" />
                        <Picker.Item label="Italian" value="italian" />
                        <Picker.Item label="Meat" value="meat" />
                        <Picker.Item label="Mexican" value="mexican" />
                        <Picker.Item label="Salads" value="salads" />
                   </Picker>
              </View>
              <View style={styles.lineItemContainer} >
                  <Text style={styles.labelText}>Estimated Calories:</Text>
                  <TextInput
                        style={styles.input}
                        onChangeText={(calories) => this.setState({calories})}
                        onEndEditing={() => {
                        if(this.verifyCalories()){
                            var temp = String(parseInt(this.state.cost, 10));
                            this.setState({cost: temp})
                        } else {
                            this.setState({modalMessage: "Calories entered incorrectly.  Enter a number between 0 and 2000.", modalVisible: true, calories: ""});}
                        }}
                        value={this.state.calories}
                   />
              </View>
              <View style={styles.lineItemContainer} >
                  <Text style={styles.labelText}>Shelf Life (days):</Text>
                   <Picker
                        selectedValue={this.state.shelfLife}
                        style={{width: '50%', backgroundColor: 'white', height: 30}}
                        itemStyle={styles.pickerItem}
                        onValueChange={(shelfLife) => this.setState({shelfLife})}
                        mode={'dropdown'}>
                        <Picker.Item label="1" value="1" />
                        <Picker.Item label="2" value="2" />
                        <Picker.Item label="3" value="3" />
                        <Picker.Item label="4" value="4" />
                        <Picker.Item label="5" value="5" />
                        <Picker.Item label="6" value="6" />
                        <Picker.Item label="7" value="7" />
                        <Picker.Item label="8" value="8" />
                        <Picker.Item label="9" value="9" />
                        <Picker.Item label="10" value="10" />
                        <Picker.Item label="11" value="11" />
                        <Picker.Item label="12" value="12" />
                   </Picker>
              </View>
              <View style={styles.lineItemContainer} >
                   <Text style={styles.labelText}>Location:</Text>
                   <Picker
                        selectedValue={this.state.location.toLowerCase()}
                        style={{width: '50%', backgroundColor: 'white', height: 30}}
                        itemStyle={styles.pickerItem}
                        onValueChange={(location) => this.setState({location})}
                        mode={'dropdown'}>
                        {this.state.locations.map((item, index) => {
                            return (<Picker.Item label={item.title} value={item.type} key={item.title}/>)
                        })}
                   </Picker>
            </View>
            <Button
              buttonStyle={styles.addNewButton}
              onPress={() => {this.addNew()}}
              color={'#2ECC71'}
              title={this.state.buttonTitle}
              titleStyle={{fontSize: 30, fontFamily: 'Poor Story'}}
            />
          </View>
        </ScrollView>
    )
  }

  render() {
    const picUndo = <TouchableOpacity
                        onPress={() => {this.setState({backgroundImage: this.state.tempPicture, pictureUndo: false, tempPicture: null })}}
                        style={{backgroundColor: 'transparent', flex: 2, alignSelf: 'flex-end'}}>
                        <Icon
                             name='md-undo'
                             size={50}
                             type='ionicon'
                             color='white'
                             containerStyle={{backgroundColor: 'transparent'}}
                          />
                      </TouchableOpacity>;

    let button;
    if(this.state.modalType == "error"){
        button = <Button
                      color="#ABEBC6"
                      onPress={this.closeModal}
                      title={this.state.modalButton}
                    />
    }
    else if(this.state.modalType == "template"){
        button = <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch'}}>
                    <Button
                      color="#B91717"
                      onPress={() => {this.addNewMeal()}}
                      title={"Cancel"}
                    />
                    <View style={{width: 10}}/>
                    <Button
                      color="#ABEBC6"
                      onPress={() => {this.addNewTemplate()}}
                      title={"Add New"}
                    />
                 </View>
    }
    else if(this.state.modalType == "loading"){
                 button = <View>
                          </View>
             }
    else {
        button = <Button
                      color="#ABEBC6"
                      onPress={() => {this.addNewMeal()}}
                      title={this.state.modalButton}
                    />
    }
    if (!this.state.fontLoaded || !this.state.paramsLoaded || this.state.cost == null || this.state.locations == null){
            return null
          }
    return (
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding" keyboardVerticalOffset={Header.HEIGHT+25}>
            <ParallaxScrollView
              windowHeight={SCREEN_HEIGHT * 0.4}
              backgroundSource={{uri: this.state.backgroundImage}}
              navBarView={<View></View>}
              navBarHeight={1}
              navBarColor='transparent'
              headerView={(<View style={{flex: 1, justifyContent: 'space-between', flexDirection: 'row'}}>
                        {this.state.pictureUndo ? picUndo : <View></View>}
                        <TouchableOpacity
                            onPress={() => {this.props.navigation.navigate('AddPicture', {returnData: this.returnData.bind(this)})}}
                            style={{backgroundColor: 'transparent', flex: 2, alignSelf: 'flex-end'}}>
                            <Icon
                                 name='md-add-circle'
                                 size={50}
                                 type='ionicon'
                                 color='white'
                                 containerStyle={{backgroundColor: 'transparent'}}
                              />
                        </TouchableOpacity>
                    </View>)}
            >
            {this.renderDescription()}
            </ParallaxScrollView>
            <Modal
                 animationType="fade"
                 transparent={true}
                 visible={this.state.modalVisible}
                 onRequestClose={this.closeModal}
                >
                 <View style={styles.modalContainer}>
                   <Text style={styles.title}>
                     {this.state.modalTitle}
                   </Text>
                   <Text style={styles.description}>
                     {this.state.modalMessage}
                   </Text>
                   {button}
                 </View>
               </Modal>
        </KeyboardAvoidingView>
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
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCDCDC",
    borderRadius: 4,
    borderColor: "#C0C0C0",
    borderWidth: 2,
    marginHorizontal: 60,
    marginVertical: 120
  },
  title: {
    padding: 20,
    fontSize: 25,
    textAlign: 'center',
    fontFamily: 'Poor Story'
  },
  description: {
    padding: 20,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Poor Story'
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
  editPicture: {
    fontFamily: 'Poor Story',
    fontSize: 18,
    color: 'white',
    textAlignVertical: 'center',
    alignSelf: 'center',
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
  addNewButton: {
      backgroundColor: '#2ECC71',
      borderRadius: 5,
      height: 75,
      marginTop: 40,
    },
  input: {
    fontFamily: 'Poor Story',
    fontSize: 20,
    textAlign: 'left',
    textAlignVertical: 'center',
    backgroundColor: '#FFF',
    alignSelf: 'flex-end',
    paddingLeft: 8,
    width: '50%',
  },
  pickerItem: {
     fontFamily: 'Poor Story',
     fontSize: 20,
     textAlign: 'center',
     textAlignVertical: 'center',
  },
  pickerInput: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-end',
    width: '50%',
  },
});
