//
//  Main.js
//
//  Created by Roni Gorodetsky.
//  Copyright © 2020 STEMinds. All rights reserved.
//

import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {View,Text,StyleSheet,TouchableOpacity,Image,StatusBar,Platform,Linking} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import I18n from "../utils/I18n";

class Main extends React.Component {

    constructor(props) {
      super(props)
      this.state = {

      }
    }

    openTermsOfService(){
      Linking.openURL("https://www.steminds.com/eduponics/terms.html").catch(err => console.error("Couldn't load page", err));
    }

    openPrivacyPolicy(){
      Linking.openURL("https://www.steminds.com/eduponics/privacy_policy.html").catch(err => console.error("Couldn't load page", err));
    }

    render() {
      return (
        <View style={styles.absolute}>
          <StatusBar
            backgroundColor="white"
            barStyle="dark-content"
          />
          <View style={styles.titleView}>
            <Text style={styles.titleText}>{I18n.t("steminds")} </Text>
            <Text style={[styles.titleText,{color:'rgba(78,185,95,100)'}]}>{I18n.t("eduponics")}</Text>
          </View>

          <Text style={styles.subtitleText}>{I18n.t("subtitleText")}</Text>

          <Image style={styles.logoGrey} source={require('../images/logo_grey.png')} resizeMode="contain"/>

          <Image style={styles.plantIllustration} source={require('../images/plant_illustration.png')} resizeMode="contain"/>

          <TouchableOpacity style={styles.letsGoButton} onPress={() => this.props.navigation.replace('AppStack', { screen: 'Control' })}>
            <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={[styles.absolute,{borderRadius:24}]}/>
            <Text style={styles.letsGoText}>{I18n.t("letsGo")}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{marginTop:hp('3.94%')}} onPress={() => this.openTermsOfService()}>
            <Text style={[styles.termsText]}>{I18n.t("termsOfService")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{marginTop:hp('0.99%')}} onPress={() => this.openPrivacyPolicy()}>
            <Text style={[styles.termsText]}>{I18n.t("privacyPolicy")}</Text>
          </TouchableOpacity>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  absolute: {
    position:'absolute',
    backgroundColor:'white',
    left:0,
    right:0,
    top:0,
    bottom:0
  },
  titleView:{
    justifyContent:'center',
    alignSelf:'center',
    ...Platform.select({
      ios: {
        marginTop:hp('11.82%'),
      },
      android: {
        marginTop:hp('8.82%'),
      }
    }),
    flexDirection: 'row'
  },
  titleText:{
    textAlign:'center',
    fontSize:hp('3.2%'),
    fontWeight:'bold',
    ...Platform.select({
      ios: {
        fontFamily:'system font'
      },
      android: {
        fontFamily:'Roboto'
      }
    })
  },
  subtitleText:{
    width:wp('100%'),
    textAlign:'center',
    marginTop:hp('1.23%'),
    fontSize:hp('2.22%'),
    alignSelf:'center',
    color:'rgba(197,204,214,100)',
    fontWeight:'bold',
    opacity:0.9,
    ...Platform.select({
      ios: {
        fontFamily:'system font'
      },
      android: {
        fontFamily:'Roboto'
      }
    })
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
    color:'white',
    ...Platform.select({
      ios: {
        fontFamily:'system font'
      },
      android: {
        fontFamily:'Roboto'
      }
    })
  },
  termsText:{
    width:'100%',
    textAlign:'center',
    alignSelf:'center',
    fontSize:hp('1.48%'),
    color:'#9DA3B4',
    fontWeight:'bold',
    ...Platform.select({
      ios: {
        fontFamily:'system font'
      },
      android: {
        fontFamily:'Roboto'
      }
    })
  }
})

export default Main;
