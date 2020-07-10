//
//  Control.js
//
//  Created by Roni Gorodetsky.
//  Copyright © 2020 STEMinds. All rights reserved.
//

import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,Platform,TextInput,Modal} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Switch } from 'react-native-switch';

import CameraModal from "../components/CameraModal";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

class Settings extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        cameraModalVisible:false,
        unique_identifier:'',
        notifications_enabled:true,
        watering_enabled:true,
        hydro_mode:true
      }
    }

    _connectPressed(){
      this.setState({cameraModalVisible:true})
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
              <Text style={styles.titleText}>MQTT Client Identifier</Text>
              <TextInput
                value={this.state.unique_identifier}
                style={[styles.subtitleText,{borderBottomWidth:0.5,borderColor:'rgba(225,227,232,100)',width:wp('78%')}]}
                onChangeText={text => this.setState({unique_identifier:text})}>
              </TextInput>
            </View>

            <View style={{marginTop:hp('2.34%')}}>
              <Text style={styles.titleText}>MQTT Broker</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.subtitleText}>My-Raspberry-Pi</Text>
                <TouchableOpacity style={{position:'absolute',width:wp('25.6%'),height:hp('3.08%'),borderRadius:15,right:wp('15%')}} onPress={() => this._connectPressed()}>
                  <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.gradientStyle}>
                    <Text style={{fontSize:hp('1.72%'), fontWeight:'bold', color:'white'}}>Connect  </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginTop:hp('3.57%'),flexDirection:'row'}}>
              <Text style={styles.titleText}>Notifications  </Text>
              <LinearGradient useAngle={true} angle={45} colors={this.state.notifications_enabled ? ['#0AC4BA','#2BDA8E'] : ['#FFFFFF','#FFFFFF']} style={[styles.switchStyle,{borderWidth:this.state.notifications_enabled ? 0 : 1.5}]}>
                <Switch
                  style={styles.switchStyle}
                  activeText={null}
                  inActiveText={null}
                  renderActiveText={false}
                  renderInActiveText={false}
                  circleSize={hp('2.2%')}
                  innerCircleStyle={{borderColor:'#E4E4E4'}}
                  circleBorderWidth={this.state.notifications_enabled ? 0 : 1}
                  backgroundActive={'transparent'}
                  backgroundInactive={'transparent'}
                  circleInActiveColor={'white'}
                  circleActiveColor={'white'}
                  switchBorderRadius={14}
                  onValueChange={() => this.setState({notifications_enabled:!this.state.notifications_enabled})}
                  value={this.state.notifications_enabled}
                />
              </LinearGradient>
            </View>

            <View style={styles.seperator}/>

            <View style={{flexDirection:'row'}}>
              <Text style={styles.titleText}>Automatic watering   </Text>
                <LinearGradient useAngle={true} angle={45} colors={this.state.watering_enabled ? ['#0AC4BA','#2BDA8E'] : ['#FFFFFF','#FFFFFF']} style={[styles.switchStyle,{borderWidth:this.state.watering_enabled ? 0 : 1.5}]}>
                  <Switch
                    style={styles.switchStyle}
                    activeText={null}
                    inActiveText={null}
                    renderActiveText={false}
                    renderInActiveText={false}
                    circleSize={hp('2.2%')}
                    innerCircleStyle={{borderColor:'#E4E4E4'}}
                    circleBorderWidth={this.state.watering_enabled ? 0 : 1}
                    backgroundActive={'transparent'}
                    backgroundInactive={'transparent'}
                    circleInActiveColor={'white'}
                    circleActiveColor={'white'}
                    switchBorderRadius={14}
                    onValueChange={() => this.setState({watering_enabled:!this.state.watering_enabled})}
                    value={this.state.watering_enabled}
                  />
                </LinearGradient>
            </View>

            <View style={styles.seperator}/>

            <View style={{flexDirection:'row'}}>
              <Text style={styles.titleText}>Hydroponics mode   </Text>
                <LinearGradient useAngle={true} angle={45} colors={this.state.hydro_mode ? ['#0AC4BA','#2BDA8E'] : ['#FFFFFF','#FFFFFF']} style={[styles.switchStyle,{borderWidth:this.state.hydro_mode ? 0 : 1.5}]}>
                  <Switch
                    style={styles.switchStyle}
                    activeText={null}
                    inActiveText={null}
                    renderActiveText={false}
                    renderInActiveText={false}
                    circleSize={hp('2.2%')}
                    innerCircleStyle={{borderColor:'#E4E4E4'}}
                    circleBorderWidth={this.state.hydro_mode ? 0 : 1}
                    backgroundActive={'transparent'}
                    backgroundInactive={'transparent'}
                    circleInActiveColor={'white'}
                    circleActiveColor={'white'}
                    switchBorderRadius={14}
                    onValueChange={() => this.setState({hydro_mode:!this.state.hydro_mode})}
                    value={this.state.hydro_mode}
                  />
                </LinearGradient>
            </View>

            <View style={styles.seperator}/>

            <TouchableOpacity style={styles.buttonStyle}>
              <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.buttonGradientStyle}>
                <Text style={{fontSize:hp('1.72%'), fontWeight:'bold', color:'white'}}>WIPE DATA  </Text>
              </LinearGradient>
            </TouchableOpacity>

          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.cameraModalVisible}
            onRequestClose={() => {this.setState({cameraModalVisible:false})}}>
            <TouchableOpacity
              style={[styles.absolute,{backgroundColor: 'rgba(100,100,100, 0.5)'}]}
              activeOpacity={1}
              onPressOut={() => {this.setState({cameraModalVisible:false})}}
            >
              <CameraModal callBack={(e) => {
                this.setState({cameraModalVisible: false,unique_identifier:e.data});
              }}/>
            </TouchableOpacity>
            </Modal>

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
    marginTop:hp('23%'),
    width:wp('84%'),
    height:hp('5.91%'),
    borderRadius:24
  },
  switchStyle:{
    width:wp('13.33%'),
    height:hp('3.05%'),
    borderRadius:14,
    alignItems: "center",
    justifyContent: "center",
    borderColor:'#E5E5E5',
    borderWidth:1.5,
    position:'absolute',
    right:wp('15%')
  }
})

export default Settings;
