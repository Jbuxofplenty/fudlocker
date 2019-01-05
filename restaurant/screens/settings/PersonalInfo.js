import React, { Component } from 'react'
import { ScrollView, Switch, Button, StyleSheet, Text, View, Share, WebView, Linking, TouchableOpacity, Image, Dimensions, Modal, TextInput, Platform } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Font } from 'expo'
import Rate, { AndroidMarket } from 'react-native-rate'
import ToggleSwitch from 'toggle-switch-react-native'
import * as firebase from 'firebase';

import BaseIcon from './Icon'
import Chevron from './Chevron'
import InfoText from './InfoText'

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
    };
  state = {
    pushNotifications: true,
    fontLoaded: false,
    mealRadius: 1.5,
    showNameEdit: true,
    name: null,
    tempName: null,
    showEmailEdit: true,
    email: null,
    tempEmail: null,
    showPhoneEdit: true,
    phone: null,
    tempPhone: '',
    showPassEdit: true,
    newPass: '',
    oldPass: 'password',
    tempPass: '',
    temp1Pass: '',
    showPassVerify: true,
    modalVisible: false,
    modal1Visible: false,
  }

  populateInfo() {
    //Get the current userID
    var userId = firebase.auth().currentUser.uid;
    //Get the user data
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        this.setState({ name: snapshot.val().name });
        this.setState({ tempName: snapshot.val().name });
        this.setState({ email: snapshot.val().email });
        this.setState({ tempEmail: snapshot.val().email });
        this.setState({ phone: snapshot.val().phone });
        this.setState({ tempPhone: snapshot.val().phone });
    }.bind(this));
  }

  toggleNameEdit() {
      this.setState({
          showNameEdit: !this.state.showNameEdit
      });
  }
  toggleEmailEdit() {
        this.setState({
            showEmailEdit: !this.state.showEmailEdit
        });
  }
  togglePhoneEdit() {
      this.setState({
          showPhoneEdit: !this.state.showPhoneEdit
      });
  }
  togglePassEdit() {
      this.setState({
          showPassEdit: !this.state.showPassEdit
      });
  }
  togglePassVerify() {
    this.setState({
      showPassVerify: !this.state.showPassVerify
    });
    this.setState({
      tempPass: ''
    });
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

    this.populateInfo();
  }

   closeModal = () => {
       this.setState({ modalVisible: false });
       this.setState({ tempPass: "" });
   };
   close1Modal = () => {
       this.setState({ modal1Visible: false });
       this.setState({ tempPass: "" });
       this.setState({ temp1Pass: "" });
   };

   updateData = () => {
      //Get the current userID
      var userId = firebase.auth().currentUser.uid;
      firebase.database().ref('users/' + userId).update({
        name: this.state.name,
        email: this.state.email,
        phone : this.state.phone
      });
   }
   async verifyOldPass() {
        var user = firebase.auth().currentUser;
        var credential = await firebase.auth.EmailAuthProvider.credential(
                                   this.state.email,
                                   this.state.tempPass
                               );
        user.reauthenticateAndRetrieveDataWithCredential(credential).then(function() {
          this.togglePassVerify();
          this.togglePassEdit();
        }.bind(this)).catch(function(error) {
          this.setState({modalVisible: true});
        }.bind(this));
   }

   updatePass = () => {
        var user = firebase.auth().currentUser;
        user.updatePassword(this.state.tempPass).then(function() {
          // Update successful.
        }).catch(function(error) {
          // An error happened.
        });
   }

  render() {
    const avatar="http://fudlkr.com/images/josiah_buxton.jpg";
    if (this.state.fontLoaded && this.state.name != null ){
        if (this.state.showNameEdit && this.state.showPhoneEdit && this.state.showEmailEdit && this.state.showPassEdit && this.state.showPassVerify) {
            return (
              <View style={styles.container}>
                <Image style={styles.avatar}
                    source={{ uri: avatar }}
                  />
                <View style={styles.nameContainer}>
                    <View style={styles.nameSubContainer}>
                        <View style={styles.labelContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Name:
                                </Text>
                            </View>
                            <Text style={styles.name}>
                                {this.state.name}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempName: this.state.name}); this.toggleNameEdit()}}>
                            <Text style={styles.edit}>edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <View style={styles.nameSubContainer}>
                        <View style={styles.labelContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Email Address:
                                </Text>
                            </View>
                            <Text style={styles.email}>
                                {this.state.email}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempEmail: this.state.email}); this.toggleEmailEdit()}}>
                            <Text style={styles.edit}>edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <View style={styles.nameSubContainer}>
                        <View style={styles.labelContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Phone:
                                </Text>
                            </View>
                            <Text style={styles.phone}>
                                {this.state.phone}
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempPhone: this.state.phone}); this.togglePhoneEdit()}}>
                            <Text style={styles.edit}>edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <View style={styles.nameSubContainer}>
                        <View style={styles.labelContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>
                                    Password:
                                </Text>
                            </View>
                            <TextInput
                                style={styles.phone}
                                secureTextEntry={true}
                                >
                                {this.state.oldPass}
                            </TextInput>
                        </View>
                        <TouchableOpacity style={styles.editContainer} onPress={() => {this.togglePassEdit()}}>
                            <Text style={styles.edit}>edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height: Dimensions.get('window').width/2}}>
                </View>
              </View>
            )}
        if ( !this.state.showNameEdit ){
            return (
                <KeyboardAwareScrollView
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={styles.scrollContainer}
                    scrollEnabled={true}
                    enableOnAndroid={true}
                    enableAutoAutomaticScroll={(Platform.OS === 'ios')}
                    automaticallyAdjustContentInsets={false}
                    extraHeight={200}
                    >
                   <Image style={styles.avatar}
                       source={{ uri: avatar }}
                     />
                   <View style={styles.nameContainer}>
                       <View style={styles.nameSubContainer}>
                           <View style={styles.labelContainer}>
                               <View style={styles.labelContainer}>
                                   <Text style={styles.label}>
                                       Name:
                                   </Text>
                               </View>
                               <TextInput
                                    style={styles.nameInput}
                                    autoCapitalize={'words'}
                                    onChangeText={(name) => this.setState({name})}
                                    value={this.state.name}
                                    textContentType={'name'}
                                    autoFocus={true}
                               >
                               </TextInput>
                           </View>
                           <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                               <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({name: this.state.tempName}); this.toggleNameEdit()}}>
                                   <Text style={styles.edit}>cancel </Text>
                               </TouchableOpacity>
                               <View style={styles.separatorContainer}>
                                      <Text style={styles.edit}>|</Text>
                                  </View>
                               <TouchableOpacity style={styles.editContainer} onPress={() => {this.toggleNameEdit();this.updateData();}}>
                                   <Text style={styles.edit}>save</Text>
                               </TouchableOpacity>
                           </View>
                       </View>
                   </View>
                   <View style={styles.nameContainer}>
                      <View style={styles.nameSubContainer}>
                          <View style={styles.labelContainer}>
                              <View style={styles.labelContainer}>
                                  <Text style={styles.label}>
                                      Email Address:
                                  </Text>
                              </View>
                              <Text style={styles.email}>
                                  {this.state.email}
                              </Text>
                          </View>
                          <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempEmail: this.state.email}); this.toggleEmailEdit()}}>
                              <Text style={styles.edit}>edit</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
                  <View style={styles.nameContainer}>
                      <View style={styles.nameSubContainer}>
                          <View style={styles.labelContainer}>
                              <View style={styles.labelContainer}>
                                  <Text style={styles.label}>
                                      Phone:
                                  </Text>
                              </View>
                              <Text style={styles.phone}>
                                  {this.state.phone}
                              </Text>
                          </View>
                          <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempPhone: this.state.phone}); this.togglePhoneEdit()}}>
                              <Text style={styles.edit}>edit</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
                  <View style={styles.nameContainer}>
                      <View style={styles.nameSubContainer}>
                          <View style={styles.labelContainer}>
                              <View style={styles.labelContainer}>
                                  <Text style={styles.label}>
                                      Password:
                                  </Text>
                              </View>
                              <TextInput
                                  style={styles.phone}
                                  secureTextEntry={true}
                                  >
                                  {this.state.oldPass}
                              </TextInput>
                          </View>
                          <TouchableOpacity style={styles.editContainer} onPress={() => {this.togglePassEdit()}}>
                              <Text style={styles.edit}>edit</Text>
                          </TouchableOpacity>
                      </View>
                  </View>
            <View style={{height: Dimensions.get('window').width/2}}>
           </View>
         </KeyboardAwareScrollView >
       )}
    if ( !this.state.showEmailEdit ){
        return (
        <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.scrollContainer}
            scrollEnabled={true}
            enableOnAndroid={true}
            enableAutoAutomaticScroll={(Platform.OS === 'ios')}
            automaticallyAdjustContentInsets={false}
            extraHeight={200}
            >
                 <Image style={styles.avatar}
                   source={{ uri: avatar }}
                 />
               <View style={styles.nameContainer}>
                   <View style={styles.nameSubContainer}>
                       <View style={styles.labelContainer}>
                           <View style={styles.labelContainer}>
                               <Text style={styles.label}>
                                   Name:
                               </Text>
                           </View>
                           <Text style={styles.name}>
                               {this.state.name}
                           </Text>
                       </View>
                       <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempName: this.state.name}); this.toggleNameEdit()}}>
                           <Text style={styles.edit}>edit</Text>
                       </TouchableOpacity>
                   </View>
               </View>
               <View style={styles.nameContainer}>
                   <View style={styles.nameSubContainer}>
                       <View style={styles.labelContainer}>
                           <View style={styles.labelContainer}>
                               <Text style={styles.label}>
                                   Email Address:
                               </Text>
                           </View>
                           <TextInput
                                style={styles.emailInput}
                                onChangeText={(email) => this.setState({email})}
                                value={this.state.email}
                                textContentType={'emailAddress'}
                                autoFocus={true}
                           >
                           </TextInput>
                       </View>
                       <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                           <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({email: this.state.tempEmail}); this.toggleEmailEdit()}}>
                               <Text style={styles.edit}>cancel </Text>
                           </TouchableOpacity>
                           <View style={styles.separatorContainer}>
                                  <Text style={styles.edit}>|</Text>
                              </View>
                           <TouchableOpacity style={styles.editContainer} onPress={() => {this.toggleEmailEdit();this.updateData();}}>
                               <Text style={styles.edit}>save</Text>
                           </TouchableOpacity>
                       </View>
                   </View>
               </View>
               <View style={styles.nameContainer}>
                  <View style={styles.nameSubContainer}>
                      <View style={styles.labelContainer}>
                          <View style={styles.labelContainer}>
                              <Text style={styles.label}>
                                  Phone:
                              </Text>
                          </View>
                          <Text style={styles.phone}>
                              {this.state.phone}
                          </Text>
                      </View>
                      <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempPhone: this.state.phone}); this.togglePhoneEdit()}}>
                          <Text style={styles.edit}>edit</Text>
                      </TouchableOpacity>
                  </View>
              </View>
              <View style={styles.nameContainer}>
                  <View style={styles.nameSubContainer}>
                      <View style={styles.labelContainer}>
                          <View style={styles.labelContainer}>
                              <Text style={styles.label}>
                                  Password:
                              </Text>
                          </View>
                          <TextInput
                              style={styles.phone}
                              secureTextEntry={true}
                              >
                              {this.state.oldPass}
                          </TextInput>
                      </View>
                      <TouchableOpacity style={styles.editContainer} onPress={() => {this.togglePassEdit()}}>
                          <Text style={styles.edit}>edit</Text>
                      </TouchableOpacity>
                  </View>
              </View>
            <View style={{height: Dimensions.get('window').width/2}}>
           </View>
         </KeyboardAwareScrollView >
         )}
    if ( !this.state.showPhoneEdit ){
        return (
         <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.scrollContainer}
            scrollEnabled={true}
            enableOnAndroid={true}
            enableAutoAutomaticScroll={(Platform.OS === 'ios')}
            automaticallyAdjustContentInsets={false}
            extraHeight={200}
            >
           <Image style={styles.avatar}
               source={{ uri: avatar }}
             />
           <View style={styles.nameContainer}>
               <View style={styles.nameSubContainer}>
                   <View style={styles.labelContainer}>
                       <View style={styles.labelContainer}>
                           <Text style={styles.label}>
                               Name:
                           </Text>
                       </View>
                       <Text style={styles.name}>
                           {this.state.name}
                       </Text>
                   </View>
                   <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempName: this.state.name}); this.toggleNameEdit()}}>
                       <Text style={styles.edit}>edit</Text>
                   </TouchableOpacity>
               </View>
           </View>
           <View style={styles.nameContainer}>
                 <View style={styles.nameSubContainer}>
                     <View style={styles.labelContainer}>
                         <View style={styles.labelContainer}>
                             <Text style={styles.label}>
                                 Email Address:
                             </Text>
                         </View>
                         <Text style={styles.email}>
                             {this.state.email}
                         </Text>
                     </View>
                     <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempEmail: this.state.email}); this.toggleEmailEdit()}}>
                         <Text style={styles.edit}>edit</Text>
                     </TouchableOpacity>
                 </View>
             </View>
           <View style={styles.nameContainer}>
               <View style={styles.nameSubContainer}>
                   <View style={styles.labelContainer}>
                       <View style={styles.labelContainer}>
                           <Text style={styles.label}>
                               Phone:
                           </Text>
                       </View>
                       <TextInput
                            style={styles.nameInput}
                            onChangeText={(phone) => this.setState({phone})}
                            value={this.state.phone}
                            textContentType={'telephoneNumber'}
                            autoFocus={true}
                       >
                       </TextInput>
                   </View>
                   <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                       <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({phone: this.state.tempPhone}); this.togglePhoneEdit()}}>
                           <Text style={styles.edit}>cancel </Text>
                       </TouchableOpacity>
                       <View style={styles.separatorContainer}>
                              <Text style={styles.edit}>|</Text>
                          </View>
                       <TouchableOpacity style={styles.editContainer} onPress={() => {this.togglePhoneEdit();this.updateData();}}>
                           <Text style={styles.edit}>save</Text>
                       </TouchableOpacity>
                   </View>
               </View>
           </View>
           <View style={styles.nameContainer}>
                 <View style={styles.nameSubContainer}>
                     <View style={styles.labelContainer}>
                         <View style={styles.labelContainer}>
                             <Text style={styles.label}>
                                 Password:
                             </Text>
                         </View>
                         <TextInput
                             style={styles.phone}
                             secureTextEntry={true}
                             >
                             {this.state.oldPass}
                         </TextInput>
                     </View>
                     <TouchableOpacity style={styles.editContainer} onPress={() => {this.togglePassEdit()}}>
                         <Text style={styles.edit}>edit</Text>
                     </TouchableOpacity>
                 </View>
             </View>
           <View style={{height: Dimensions.get('window').width/2}}>
           </View>
         </KeyboardAwareScrollView >
       )}
    if ( !this.state.showPassEdit ){
        return (
         <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.scrollContainer}
            scrollEnabled={true}
            enableOnAndroid={true}
            enableAutoAutomaticScroll={(Platform.OS === 'ios')}
            automaticallyAdjustContentInsets={false}
            extraHeight={400}
            >
           <Image style={styles.avatar}
               source={{ uri: avatar }}
             />
           <View style={styles.nameContainer}>
               <View style={styles.nameSubContainer}>
                   <View style={styles.labelContainer}>
                       <View style={styles.labelContainer}>
                           <Text style={styles.label}>
                               Name:
                           </Text>
                       </View>
                       <Text style={styles.name}>
                           {this.state.name}
                       </Text>
                   </View>
                   <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempName: this.state.name}); this.toggleNameEdit()}}>
                       <Text style={styles.edit}>edit</Text>
                   </TouchableOpacity>
               </View>
           </View>
           <View style={styles.nameContainer}>
                 <View style={styles.nameSubContainer}>
                     <View style={styles.labelContainer}>
                         <View style={styles.labelContainer}>
                             <Text style={styles.label}>
                                 Email Address:
                             </Text>
                         </View>
                         <Text style={styles.email}>
                             {this.state.email}
                         </Text>
                     </View>
                     <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempEmail: this.state.email}); this.toggleEmailEdit()}}>
                         <Text style={styles.edit}>edit</Text>
                     </TouchableOpacity>
                 </View>
             </View>
           <View style={styles.nameContainer}>
              <View style={styles.nameSubContainer}>
                  <View style={styles.labelContainer}>
                      <View style={styles.labelContainer}>
                          <Text style={styles.label}>
                              Phone:
                          </Text>
                      </View>
                      <Text style={styles.phone}>
                          {this.state.phone}
                      </Text>
                  </View>
                  <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempPhone: this.state.phone}); this.togglePhoneEdit()}}>
                      <Text style={styles.edit}>edit</Text>
                  </TouchableOpacity>
              </View>
           </View>
           <View style={styles.nameContainer}>
               <View style={styles.nameSubContainer}>
                   <View style={styles.labelContainer}>
                       <View style={styles.labelContainer}>
                           <Text style={styles.label}>
                               Verify Old Password:
                           </Text>
                       </View>
                       <TextInput
                            style={styles.nameInput}
                            onChangeText={(tempPass) => this.setState({tempPass})}
                            value={this.state.tempPass}
                            textContentType={'password'}
                            autoFocus={true}
                            secureTextEntry={true}
                            autoCapitalize={'none'}
                       >
                       </TextInput>
                   </View>
                   <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                       <TouchableOpacity style={styles.editContainer} onPress={() => {this.togglePassEdit()}}>
                           <Text style={styles.edit}>cancel </Text>
                       </TouchableOpacity>
                       <View style={styles.separatorContainer}>
                              <Text style={styles.edit}>|</Text>
                          </View>
                       <TouchableOpacity style={styles.editContainer} onPress={() => {
                          this.verifyOldPass();
                        }}>
                           <Text style={styles.edit}>verify</Text>
                       </TouchableOpacity>
                   </View>
               </View>
           </View>
           <View style={{height: Dimensions.get('window').width}}>
           </View>
           <Modal
             animationType="fade"
             transparent={true}
             visible={this.state.modalVisible}
             onRequestClose={this.closeModal}
            >
             <View style={styles.modalContainer}>
               <Text style={styles.title}>
                 {"Invalid Password! "}
               </Text>
               <Text style={styles.description}>
                 {"Please correctly enter your current password. \n\n"}
               </Text>
               <Button
                 color="#ABEBC6"
                 onPress={this.closeModal}
                 title="    OK    "
               />
             </View>
           </Modal>
         </KeyboardAwareScrollView >
       )}
    if ( !this.state.showPassVerify ){
        return (
         <KeyboardAwareScrollView
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.scrollContainer}
            scrollEnabled={true}
            enableOnAndroid={true}
            enableAutoAutomaticScroll={(Platform.OS === 'ios')}
            automaticallyAdjustContentInsets={false}
            extraHeight={200}
            >
           <Image style={styles.avatar}
               source={{ uri: avatar }}
             />
           <View style={styles.nameContainer}>
               <View style={styles.nameSubContainer}>
                   <View style={styles.labelContainer}>
                       <View style={styles.labelContainer}>
                           <Text style={styles.label}>
                               Name:
                           </Text>
                       </View>
                       <Text style={styles.name}>
                           {this.state.name}
                       </Text>
                   </View>
                   <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempName: this.state.name}); this.toggleNameEdit()}}>
                       <Text style={styles.edit}>edit</Text>
                   </TouchableOpacity>
               </View>
           </View>
           <View style={styles.nameContainer}>
                 <View style={styles.nameSubContainer}>
                     <View style={styles.labelContainer}>
                         <View style={styles.labelContainer}>
                             <Text style={styles.label}>
                                 Email Address:
                             </Text>
                         </View>
                         <Text style={styles.email}>
                             {this.state.email}
                         </Text>
                     </View>
                     <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempEmail: this.state.email}); this.toggleEmailEdit()}}>
                         <Text style={styles.edit}>edit</Text>
                     </TouchableOpacity>
                 </View>
             </View>
           <View style={styles.nameContainer}>
              <View style={styles.nameSubContainer}>
                  <View style={styles.labelContainer}>
                      <View style={styles.labelContainer}>
                          <Text style={styles.label}>
                              Phone:
                          </Text>
                      </View>
                      <Text style={styles.phone}>
                          {this.state.phone}
                      </Text>
                  </View>
                  <TouchableOpacity style={styles.editContainer} onPress={() => {this.setState({tempPhone: this.state.phone}); this.togglePhoneEdit()}}>
                      <Text style={styles.edit}>edit</Text>
                  </TouchableOpacity>
              </View>
           </View>
           <View style={styles.nameContainer}>
               <View style={styles.nameSubContainer}>
                   <View style={{flex: 1, flexDirection: 'column'}}>
                       <View style={styles.labelContainer}>
                           <View style={styles.labelContainer}>
                               <Text style={styles.label}>
                                   New Password:
                               </Text>
                           </View>
                           <TextInput style={styles.nameInput}
                                   onChangeText={(tempPass) => this.setState({tempPass})}
                                   value={this.state.tempPass}
                                   textContentType={'password'}
                                   autoFocus={true}
                                   secureTextEntry={true}
                                   autoCapitalize={'none'}
                              >
                              </TextInput>
                       </View>
                       <View style={styles.labelContainer}>
                           <View style={styles.labelContainer}>
                              <Text style={styles.label}>
                                  Verify Password:
                              </Text>
                          </View>
                          <TextInput
                             style={styles.nameInput}
                             onChangeText={(temp1Pass) => this.setState({temp1Pass})}
                             value={this.state.temp1Pass}
                             textContentType={'password'}
                             secureTextEntry={true}
                             autoCapitalize={'none'}
                        >
                        </TextInput>
                       </View>
                   </View>
                   <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                       <TouchableOpacity style={styles.editContainer} onPress={() => {this.togglePassVerify()}}>
                           <Text style={styles.edit}>cancel </Text>
                       </TouchableOpacity>
                       <View style={styles.separatorContainer}>
                              <Text style={styles.edit}>|</Text>
                          </View>
                       <TouchableOpacity style={styles.editContainer} onPress={() => {
                        if(this.state.tempPass==this.state.temp1Pass) {
                            this.togglePassVerify();
                            this.updatePass();
                        }
                        else {
                            this.setState({modal1Visible: true});
                        }}}>
                           <Text style={styles.edit}>save</Text>
                       </TouchableOpacity>
                   </View>
               </View>
           </View>
           <View style={{height: Dimensions.get('window').width}}>
           </View>
           <Modal
             animationType="fade"
             transparent={true}
             visible={this.state.modal1Visible}
             onRequestClose={this.close1Modal}
            >
             <View style={styles.modalContainer}>
               <Text style={styles.title}>
                 {"Passwords Do Not Match! "}
               </Text>
               <Text style={styles.description}>
                 {"Please correctly enter your new password. \n\n"}
               </Text>
               <Button
                 color="#ABEBC6"
                 onPress={this.close1Modal}
                 title="    OK    "
               />
             </View>
           </Modal>
         </KeyboardAwareScrollView >
       )}
    } else {
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
  scrollContainer: {
      flexGrow: 1,
      backgroundColor: '#fff',
      flexDirection: 'column',
      alignItems: 'center',
    },
  avatar: {
    width: '50%',
    height: Dimensions.get('window').width/2,
    margin: 10,
  },
  labelContainer: {
      backgroundColor: '#F9F9F9',
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
  nameContainer: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 0,
    margin: 10,
    padding: 20,
    paddingBottom: 10
  },
  nameSubContainer: {
      width: '100%',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
  edit: {
      fontFamily: 'Poor Story',
      color: 'blue',
      fontSize: 15,
      textAlignVertical: 'center',
      textAlign: 'right',
    },
  editContainer: {
    width: '20%',
    backgroundColor: '#FFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 5,
  },
  separatorContainer: {
    width: '5%',
    backgroundColor: '#FFF',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 5,
  },
  nameInput: {
      fontFamily: 'Poor Story',
      fontSize: 35,
      textAlign: 'center',
      textAlignVertical: 'center',
      backgroundColor: '#FFF',
      justifyContent: 'space-between',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: 3,
      width: '80%',
    },
  emailInput: {
    fontFamily: 'Poor Story',
    fontSize: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 3,
    width: '80%',
  },
  name: {
    fontFamily: 'Poor Story',
    fontSize: 20,
    textAlignVertical: 'center'
  },
  email: {
    fontFamily: 'Poor Story',
    fontSize: 20,
    textAlignVertical: 'center'
  },
  phone: {
    fontFamily: 'Poor Story',
    fontSize: 20,
    textAlignVertical: 'center'
  },
  label: {
    fontFamily: 'Poor Story',
    textAlignVertical: 'center',
    fontSize: 16
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
    }
});
