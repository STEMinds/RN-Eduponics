//
//  Control.js
//
//  Created by Roni Gorodetsky.
//  Copyright © 2020 STEMinds. All rights reserved.
//

import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,Platform} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import I18n from "../utils/I18n";

class Learn extends React.Component {

    constructor(props) {
      super(props)
      this.state = {

      }
      this.props.navigation.addListener(
        'focus',
        payload => {
          console.log('Learn is focused');
        }
      );
    }

    render() {
      return (
        <View style={styles.absolute}>
          <View style={styles.container}>

          </View>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  absolute: {
    position:'absolute',
    left:0,
    right:0,
    top:0,
    bottom:0,
    backgroundColor:'white'
  },
  topNavBar:{
    flexDirection:'row',
    ...Platform.select({
      ios: {
        marginTop:hp('5%')
      },
      android: {
        marginTop:hp('2%')
      }
    })
  },
  container:{
    left:wp('8%')
  }
})

export default Learn;
