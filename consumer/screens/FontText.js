import { Text } from 'react-native' ;
import React, { Component } from 'react' ;
import { connect } from 'react-redux' ;
import { Font } from 'expo';

class FontText extends Component {
state = {
        fontLoaded: false,
    };
async componentDidMount() {
    await Font.loadAsync({
        'Poor Story': require('../assets/fonts/PoorStory-Regular.ttf'),
    });

        this.state.fontLoaded = true;
    }
Loadtext(){
    if(this.state.fontLoaded){
      return (<Text style={this.props.style}>{this.props.children}</Text>) ;
    }
    else {
    return null;
    }

  }
render(){
    return (
      this.Loadtext()
    );
  }
}
export default (FontText) ;