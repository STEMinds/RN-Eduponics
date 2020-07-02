//
//  Main.js
//
//  Created by Roni Gorodetsky.
//  Copyright © 2020 STEMinds. All rights reserved.
//

import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {View,Text,StyleSheet,TouchableOpacity,Image,StatusBar} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

class Main extends React.Component {

    constructor(props) {
      super(props)
      this.state = {

      }
    }

    render() {
      return (
        <View style={styles.absolute}>

          <View style={styles.titleView}>
            <Text style={styles.titleText}>STEMinds</Text>
            <Text style={[styles.titleText,{color:'rgba(78,185,95,100)'}]}>Eduponics</Text>
          </View>

          <Text style={styles.subtitleText}>Make your own IoT farm</Text>

          <Image style={styles.logoGrey} source={require('../images/logo_grey.png')}/>

          <Image style={styles.plantIllustration} source={require('../images/plant_illustration.png')}/>

          <TouchableOpacity style={styles.letsGoButton} onPress={() => this.props.navigation.replace('Control')}>
            <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={[styles.absolute,{borderRadius:24}]}/>
            <Text style={styles.letsGoText}>Let's Go!</Text>
          </TouchableOpacity>

          <Text style={[styles.termsText,{marginTop:32}]}>Terms of service</Text>
          <Text style={[styles.termsText,{marginTop:8}]}>Privacy policy</Text>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  absolute: {
    backgroundColor:'white',
    position:'absolute',
    left:0,
    right:0,
    top:0,
    bottom:0
  },
  titleView:{
    justifyContent:'center',
    alignSelf:'center',
    marginTop:hp('11.82%'),
    flexDirection: 'row'
  },
  titleText:{
    width:wp('35%'),
    textAlign:'center',
    fontSize:hp('3.2%'),
    fontWeight:'bold'
  },
  subtitleText:{
    width:wp('100%'),
    textAlign:'center',
    marginTop:hp('1.23%'),
    fontSize:hp('2.22%'),
    alignSelf:'center',
    color:'rgba(197,204,214,100)',
    fontWeight:'bold',
    opacity:0.9
  },
  logoGrey:{
    marginTop:hp('3.69%'),
    alignSelf:'center',
    width:wp('27.73%'),
    height:hp('4.06%')
  },
  plantIllustration:{
    marginTop:hp('6.28%'),
    alignSelf:'center',
    width:wp('66.13%'),
    height:hp('33.99%'),
  },
  letsGoButton:{
    marginTop:hp('9.48%'),
    width:wp('73.33%'),
    height:hp('5.91%'),
    borderRadius:24,
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center'
  },
  letsGoText:{
    textAlign:'center',
    alignSelf:'center',
    width:wp('100%'),
    fontSize:hp('1.72%'),
    fontWeight:'bold',
    color:'white'
  },
  termsText:{
    width:'100%',
    textAlign:'center',
    alignSelf:'center',
    fontSize:hp('1.48%'),
    color:'#9DA3B4',
    fontWeight:'bold'
  }
})

export default Main;
