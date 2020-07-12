//
//  Control.js
//
//  Created by Roni Gorodetsky.
//  Copyright © 2020 STEMinds. All rights reserved.
//

import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,ImageBackground,Platform,TextInput,Modal,DevSettings,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Switch } from 'react-native-switch';
import AsyncStorage from '@react-native-community/async-storage';
import CameraModal from "../components/CameraModal";
import SuccessModal from "../components/SuccessModal";
import FailedModal from "../components/FailedModal";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

class Settings extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        cameraModalVisible:false,
        identifier:'',
        notifications_enabled:true,
        watering_enabled:true,
        hydro_mode:true,
        connected:false,
        successModalVisible:false,
        failedModalVisible:false
      }
      this.props.navigation.addListener(
        'focus',
        payload => {
          console.log('Settings is focused');
        }
      );
    }

    async componentDidMount() {
      // get saved data if not introduced already
      if(this.state.identifier == ''){
        try {
          const value = await AsyncStorage.getItem('@identifier')
          if(value !== null) {
            // value previously stored
            this.setState({
              identifier:value,
              connected:true
            })
          }else{
            // value not stored, change status to disconnected
            this.setState({
              connected:false
            })
          }
        } catch (e) {
          // saving error
          console.log("error saving identifier",e)
        }
      }
    }

    async _saveIdentifierToStorage(){
      // make sure the identifier is UUID
      var uuid_re = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if(uuid_re.test(this.state.identifier)){
        // identifer is correct, save data
        try {
          await AsyncStorage.setItem('@identifier', this.state.identifier)
        } catch (e) {
          // saving error
          console.log("error saving identifier",e)
        }
        // Change state to connected and show success modal
        this.setState({
          connected:true,
          successModalVisible:true
        })
      }else{
        // Regex is wrong, show failed modal
        this.setState({
          connected:false,
          failedModalVisible:true
        })
      }
    }

    _cameraIconPressed(){
      this.setState({cameraModalVisible:true})
    }

    _renderConnectionState(){
      if(this.state.connected){
        return(
          <View style={{alignItems:'center',justifyContent:'center',position:'absolute',width:wp('27.6%'),height:hp('4.2%'),borderRadius:20,right:wp('15%')}}>
            <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.gradientStyle}>
              <Text style={{fontSize:hp('1.72%'), fontWeight:'bold', color:'white'}}>Connected</Text>
            </LinearGradient>
          </View>
        )
      }else{
        return(
          <ImageBackground source={require('../images/label-border.png')} style={{alignItems:'center',justifyContent:'center',position:'absolute',width:wp('27.6%'),height:hp('4.2%'),right:wp('15%')}}>
                <Text style={{fontSize:hp('1.72%'), fontWeight:'bold', color:'#0AC4BA'}}>Disconnected</Text>
          </ImageBackground>
        )
      }
    }

    _wipeAsyncStorage = async() => {
        Alert.alert(
        "Wipe local app data",
        "Are you sure you want to reset the app and wipe your local data?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Wipe", onPress: () => {
            this.setState({identifer:''})
            AsyncStorage.clear();
            DevSettings.reload()
          } }
        ],
        { cancelable: false }
      );
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
                placeholder={"Your personal UUID goes here"}
                value={this.state.identifier}
                style={[styles.subtitleText,{borderBottomWidth:0.5,borderColor:'rgba(225,227,232,100)',width:wp('78%')}]}
                onChangeText={text => this.setState({identifier:text})}
                onSubmitEditing={() => this._saveIdentifierToStorage()}>
              </TextInput>
            </View>

            <View style={{marginTop:hp('2.34%')}}>
              <Text style={styles.titleText}>MQTT Broker</Text>
              <View style={{flexDirection:'row'}}>
                <Text style={styles.subtitleText}>mqtt.eclipse.org:1883</Text>
                {this._renderConnectionState()}
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

            <TouchableOpacity style={styles.buttonStyle} onPress={() => this._wipeAsyncStorage()}>
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
                this.setState({cameraModalVisible: false,identifier:e.data});
              }}/>
            </TouchableOpacity>
            </Modal>

            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.successModalVisible}
              onRequestClose={() => {this.setState({successModalVisible:false})}}>
              <TouchableOpacity
                style={[styles.absolute,{backgroundColor: 'rgba(100,100,100, 0.5)'}]}
                activeOpacity={1}
                onPressOut={() => {this.setState({successModalVisible:false})}}
              >
                <SuccessModal callBack={(e) => {
                  this.setState({successModalVisible: false});
                  this.props.navigation.navigate('AppStack', { screen: 'Settings' })
                }}/>
              </TouchableOpacity>
              </Modal>

              <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.failedModalVisible}
                onRequestClose={() => {this.setState({failedModalVisible:false})}}>
                <TouchableOpacity
                  style={[styles.absolute,{backgroundColor: 'rgba(100,100,100, 0.5)'}]}
                  activeOpacity={1}
                  onPressOut={() => {this.setState({failedModalVisible:false})}}
                >
                  <FailedModal callBack={(e) => {
                    this.setState({failedModalVisible: false});
                    this.props.navigation.navigate('AppStack', { screen: 'Settings' })
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
    width:wp('27.6%'),
    height:hp('4.2%'),
    borderRadius:20,
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
