import React, { Component } from 'react';
import { WebView, Linking } from 'react-native';

export default class WebViewScreen extends Component {
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
         
  render() {
    const uri = this.props.navigation.state.params.uri;
    return (
      <WebView
        ref={(ref) => { this.webview = ref; }}
        source={{ uri }}
        onNavigationStateChange={(event) => {
          if (event.url !== uri) {
            this.webview.stopLoading();
            Linking.openURL(event.url);
          }
        }}
      />
    );
  }
}
