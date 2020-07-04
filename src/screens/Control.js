//
//  Control.js
//
//  Created by Roni Gorodetsky.
//  Copyright © 2020 STEMinds. All rights reserved.
//

import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {View,Text,StyleSheet,TouchableOpacity,Image,StatusBar,Platform} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

class Control extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        mode:"soil",
        data:{
          temp:25.5,
          humidity:70,
          sunlight:3000,
          water_quantity:"Normal"
        },
        sensors:{
          'A':{
            'name':'Plant A',
            'enabled':true,
            'moisture':'100%'
          },
          'B':{
            'name':'Plant B',
            'enabled':true,
            'moisture':'75%'
          },
          'C':{
            'name':'Plant C',
            'enabled':true,
            'moisture':'25%'
          },
          'D':{
            'name':'Plant D',
            'enabled':false,
            'moisture':'0%'
          }
        }
      }
    }

    _renderSoilSensors(){
        sensors = Object.keys(this.state.sensors).map(key =>
        <View style={styles.soilMoistureBox} key={key}>
          <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={[styles.absolute,{borderRadius:6,width:this.state.sensors[key].moisture}]}/>
          <Image source={require('../images/water_drop.png')} style={styles.waterDrop}/>
          <View style={{flexDirection:'column',marginLeft:wp('2.67%'),alignSelf:'center'}}>
            <Text style={styles.plantNameText}>{this.state.sensors[key].name}</Text>
            <Text style={styles.plantSoilText}>Soil moisture</Text>
          </View>
          <Text style={styles.soilQuantityText}>{this.state.sensors[key].moisture}</Text>
          <TouchableOpacity style={styles.powerButton} disabled={!this.state.sensors[key].enabled}>
            <LinearGradient useAngle={true} angle={45} colors={this.state.sensors[key].enabled ? ['#0AC4BA','#2BDA8E'] : ['#ABC2E1','#ABC2E1']} style={[styles.absolute,{borderBottomRightRadius:6,borderTopLeftRadius:6}]}/>
            <Image source={require('../images/power_button.png')} style={{alignSelf:'center',tintColor: this.state.sensors[key].enabled ? 'white' : '#4D72A3', opacity: this.state.sensors[key].enabled ? 1 : 0.6}}/>
          </TouchableOpacity>
        </View>
      )
      return sensors
    }

    _goToSettings(){
      this.props.navigation.navigate('Settings');
    }

    _goToLearning(){
      this.props.navigation.navigate('Learn');
    }

    render() {
        return (
          <View style={styles.absolute}>
            <LinearGradient colors={['#FFFFFF','#D4E5F8']} style={styles.absolute}/>
            <Image source={require('../images/flower_illustration.png')} style={styles.flowerIllustration}/>
            <View style={styles.container}>

              <Text style={styles.introText}>Good Morning</Text>

              <View style={[styles.dataContainer,{marginTop:hp('2%')}]}>
                <Text style={styles.infoTitle}>Water quantity</Text>
                <Text style={styles.infoSubtitle}>{this.state.data.water_quantity}</Text>
              </View>

              <View style={styles.dataContainer}>
                <Text style={styles.infoTitle}>Temperature</Text>
                <Text style={styles.infoSubtitle}>{this.state.data.temp}℃</Text>
              </View>

              <View style={styles.dataContainer}>
                <Text style={styles.infoTitle}>Humidity</Text>
                <Text style={styles.infoSubtitle}>{this.state.data.humidity}%</Text>
              </View>

              <View>
                <Text style={styles.infoTitle}>Sunlight</Text>
                <Text style={styles.infoSubtitle}>{this.state.data.sunlight} lx</Text>
              </View>

              <Text style={styles.controlText}>Control</Text>
              <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.controlLinear}/>

              <View style={styles.soilMoistureContainer}>

              {this._renderSoilSensors()}

              </View>
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
  flowerIllustration:{
    position:'absolute',
    right:wp('-13.8%'),
    marginTop:hp('-3%')
  },
  container:{
    left:wp('8%')
  },
  introText:{
    width:wp('100%'),
    marginTop:hp('2%'),
    fontSize:hp('3.2%'),
    fontWeight:'bold'
  },
  infoTitle:{
    fontSize:hp('1.48%'),
    opacity:0.4
  },
  infoSubtitle:{
    marginTop:hp('1.23%'),
    fontSize:hp('2.22%'),
    fontWeight:'600'
  },
  dataContainer:{
    marginBottom:hp('1.69%')
  },
  controlText:{
    marginTop:hp('3.39%'),
    fontSize:hp('2.46%'),
    fontWeight:'bold'
  },
  controlLinear:{
    height:hp('0.49%'),
    width:wp('18.67%'),
    marginTop:hp('0.49%')
  },
  soilMoistureContainer:{
    marginTop:hp('3.69%')
  },
  soilMoistureBox:{
    flexDirection:'row',
    backgroundColor:'#C8DBF5',
    width:wp('84%'),
    height:hp('7.39%'),
    borderRadius:6,
    marginBottom:hp('2.69%')
  },
  waterDrop:{
    alignSelf:'center',
    marginLeft:wp('4.27%'),
    width:hp('3.45%'),
    height:hp('3.45%')
  },
  plantNameText:{
    fontSize:hp('1.72%'),
    fontWeight:'bold',
    color:'white',
    marginBottom:hp('0.25%')
  },
  plantSoilText:{
    opacity:0.7,
    fontSize:hp('1.48%'),
    color:'white'
  },
  powerButton:{
    position:'absolute',
    justifyContent:'center',
    borderWidth:1,
    borderColor:'white',
    borderBottomRightRadius:6,
    borderTopLeftRadius:6,
    height:40,
    width:40,
    bottom:0,
    right:0
  },
  soilQuantityText:{
    position:'absolute',
    textAlign:'right',
    width:wp('100%'),
    bottom:hp('1.6%'),
    color:'white',
    fontSize:hp('1.7%'),
    fontWeight:'600',
    right:wp('13%')
  }
})

export default Control;
