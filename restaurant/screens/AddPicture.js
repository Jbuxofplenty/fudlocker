import React from 'react';
import { Text, View, TouchableOpacity, Button, Image } from 'react-native';
import { Camera, Permissions, ImagePicker } from 'expo';
import * as firebase from 'firebase';
import { Icon } from 'react-native-elements';

export default class AddPicture extends React.Component {
  static navigationOptions = ({ navigation }) => {
     return {
       title: "Add Picture",
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
    hasCameraPermission: null,
    hasCameraRollPermission: null,
    type: Camera.Constants.Type.back,
    flashMode: Camera.Constants.FlashMode.auto,
    flashOn: true,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    const { roll_status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ hasCameraRollPermission: status === 'granted' });
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      this.props.navigation.state.params.returnData(photo);
      this.props.navigation.goBack();
    }
  };

    _pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.cancelled) {
          this.props.navigation.state.params.returnData(result);
          this.props.navigation.goBack();
      }
    };

  render() {
    const { hasCameraPermission, hasCameraRollPermission } = this.state;
    const flashOn = <Icon
                       name='md-flash'
                       size={30}
                       type='ionicon'
                       color='white'
                       containerStyle={{backgroundColor: 'transparent', marginRight: 10, marginBottom: 20}}
                     />;
    const flashOff = <Icon
                       name='md-flash-off'
                       size={30}
                       type='ionicon'
                       color='white'
                       containerStyle={{backgroundColor: 'transparent', marginRight: 10, marginBottom: 20}}
                     />;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type: this.state.type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back,
                  });
                }}>
                <Icon
                    name='md-swap'
                    size={30}
                    type='ionicon'
                    color='white'
                    containerStyle={{backgroundColor: 'transparent', marginLeft: 10, marginBottom: 20}}
                 />
              </TouchableOpacity>
              { hasCameraRollPermission === null ? null :
                  <TouchableOpacity
                    style={{
                      flex: 0.1,
                      alignSelf: 'flex-end',
                      alignItems: 'center',
                    }}
                    onPress={this._pickImage}>
                    <Icon
                        name='md-images'
                        size={30}
                        type='ionicon'
                        color='white'
                        containerStyle={{backgroundColor: 'transparent', marginBottom: 20}}
                     />
                  </TouchableOpacity>
              }
              <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.snap()
                  }}>
                  <Icon
                      name='md-camera'
                      size={30}
                      type='ionicon'
                      color='white'
                      containerStyle={{backgroundColor: 'transparent', marginBottom: 20}}
                   />
              </TouchableOpacity>
              <TouchableOpacity
                  style={{
                    flex: 0.1,
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    this.setState({
                      type: this.state.flashMode === Camera.Constants.FlashMode
                        ? Camera.Constants.FlashMode.on
                        : Camera.Constants.FlashMode.off,
                      flashOn: !this.state.flashOn,
                    });
                  }}>
                  {this.state.flashOn ? flashOn : flashOff}
               </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}