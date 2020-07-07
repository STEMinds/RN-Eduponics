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

class Settings extends React.Component {

    constructor(props) {
      super(props)
      this.state = {

      }
    }

    render() {
      return (
        <View style={styles.absolute}>
          <View style={styles.container}>

            <View style={{marginTop:hp('2.83%')}}>
              <Text style={styles.titleText}>Name</Text>
              <Text style={styles.subtitleText}>Roni</Text>
            </View>

            <View style={{marginTop:hp('2.34%')}}>
              <Text style={styles.titleText}>Language</Text>
              <Text style={styles.subtitleText}>English</Text>
            </View>

            <View style={{marginTop:hp('2.34%')}}>
              <Text style={styles.titleText}>MQTT address</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.subtitleText}>192.168.1.1:8080</Text>
                <TouchableOpacity style={{width:wp('25.6%'),height:hp('3.08%'),borderRadius:15}}>
                  <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.gradientStyle}>
                    <Text style={{fontSize:hp('1.72%'), fontWeight:'bold', color:'white'}}>Connect</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginTop:hp('3.57%'),flexDirection:'row'}}>
              <Text style={styles.titleText}>Notifications</Text>
            </View>

            <View style={styles.seperator}/>

            <View style={{flexDirection:'row'}}>
              <Text style={styles.titleText}>Automatic watering</Text>
            </View>

            <View style={styles.seperator}/>

            <View style={{flexDirection:'row'}}>
              <Text style={styles.titleText}>Hydroponics mode</Text>
            </View>

            <View style={styles.seperator}/>

            <TouchableOpacity style={styles.buttonStyle}>
              <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.buttonGradientStyle}>
                <Text style={{fontSize:hp('1.72%'), fontWeight:'bold', color:'white'}}>WIPE DATA</Text>
              </LinearGradient>
            </TouchableOpacity>

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
    bottom:0
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
  },
  titleText:{
    fontSize:hp('1.72%'),
    fontWeight:'bold',
    color:'rgba(197,204,214,100)'
  },
  subtitleText:{
    marginTop:hp('1.11%'),
    fontWeight:'bold',
    fontSize:hp('1.72%'),
    color:'black'
  },
  gradientStyle:{
    marginLeft:wp('27.47%'),
    width:wp('25.6%'),
    height:hp('3.08%'),
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center'
  },
  buttonGradientStyle:{
    width:wp('84%'),
    height:hp('5.91%'),
    borderRadius:24,
    alignItems:'center',
    justifyContent:'center'
  },
  seperator:{
    marginTop:hp('1.97%'),
    marginBottom:hp('1.97%'),
    borderWidth:0.5,
    width:wp('84%'),
    opacity:0.6,
    borderColor:'rgba(225,227,232,100)'
  },
  buttonStyle:{
    marginTop:hp('26.23%'),
    width:wp('84%'),
    height:hp('5.91%'),
    borderRadius:24
  }
})

export default Settings;
