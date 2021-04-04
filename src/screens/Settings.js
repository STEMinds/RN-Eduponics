//
//  Control.js
//
//  Created by Roni Gorodetsky.
//  Copyright © 2020 STEMinds. All rights reserved.
//

import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,ImageBackground,Image,Platform,TextInput,Modal,DevSettings,Alert,Linking} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { Switch } from 'react-native-switch';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';
import CameraModal from "../components/CameraModal";
import SuccessModal from "../components/SuccessModal";
import FailedModal from "../components/FailedModal";
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import I18n from "../utils/I18n";

class Settings extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        language:"English",
        cameraModalVisible:false,
        identifier:'',
        mqtt_broker:'mqtts://mqtt.eclipseprojects.io:8883',
        notifications_enabled:false,
        watering_enabled:false,
        hydro_mode:false,
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
      // debug language code
      if(I18n.t(I18n.languageCode).includes("missing")){
        // this language is corrently not supported, fall-back to English
        this.setState({language:"English"})
      }else{
        // language exist in translations
        this.setState({language:I18n.t(I18n.languageCode)})
      }
      // get saved data if not introduced already
      if(this.state.identifier == ''){
        try {
          const identifierValue = await AsyncStorage.getItem('@identifier')
          const mqttBroker = await AsyncStorage.getItem('@mqttbroker')
          if(identifierValue !== null) {
            // value previously stored
            this.setState({
              identifier:identifierValue,
              connected:true
            })
          }else{
            // value not stored, change status to disconnected
            this.setState({
              connected:false
            })
          }
          // check mqtt broker
          if(mqttBroker !== null) {
            // value previously stored
            this.setState({
              mqtt_broker:mqttBroker,
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
          identifier:'',
          failedModalVisible:true
        })
      }
    }

    async _saveBrokerToStorage(){
      var final_broker = '';
      var value = this.state.mqtt_broker.split(":");
      // make sure the identifier is UUID
      if(this.state.mqtt_broker && value.length == 2){
        // identifer is correct, save data
        try {
          // add MQTT or MQTTS based on the port
          if(value[1] == 8883){
            final_broker = "mqtts://" + this.state.mqtt_broker;
          }else{
            final_broker = "mqtt://" + this.state.mqtt_broker;
          }
          await AsyncStorage.setItem('@mqttbroker', final_broker.toLowerCase())
        } catch (e) {
          // saving error
          console.log("error saving MQTT broker",e)
        }
        // Change state to connected and show success modal
        this.setState({
          mqtt_broker:final_broker,
          successModalVisible:true
        })
      }else{
        // Regex is wrong, show failed modal
        this.setState({
          failedModalVisible:true,
          mqtt_broker:''
        })
      }
    }

    _cameraIconPressed(){
      this.setState({cameraModalVisible:true})
    }

    _renderConnectionState(){
      if(this.state.connected){
        return(
          <View style={{marginTop:hp('1.5%'), alignItems:'center',justifyContent:'center',position:'absolute',width:wp('27.6%'),height:hp('4.2%'),borderRadius:20,right:wp('15%')}}>
            <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.gradientStyle}>
              <Text style={{alignSelf:'center',textAlign:'center',fontSize:hp('1.72%'), fontWeight:'bold', color:'white', width:wp('100%')}}>{I18n.t('connected')}</Text>
            </LinearGradient>
          </View>
        )
      }else{
        return(
          <View style={{marginTop:hp('1.5%'), borderColor:"#0AC4BA",borderRadius:20,borderWidth:1.5,alignItems:'center',justifyContent:'center',position:'absolute',width:wp('27.6%'),...Platform.select({
            ios: {
              height:hp('4.2%')
            },
            android: {
              height:hp('4.53%')
            }
          }),right:wp('15%')}}>
                <Text style={{alignSelf:'center',textAlign:'center',fontSize:hp('1.72%'), fontWeight:'bold', color:'#0AC4BA', width:wp('26%')}}>{I18n.t('disconnected')}</Text>
          </View>
        )
      }
    }

    _wipeAsyncStorage = async() => {
        Alert.alert(
        I18n.t("wipeDataTitle"),
        I18n.t("wipeDataSubtitle"),
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "Wipe", onPress: () => {
            this.setState({identifer:''})
            AsyncStorage.clear();
            RNRestart.Restart();
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
              <Text style={styles.titleText}>{I18n.t("language")}</Text>
              <Text style={styles.subtitleText}>{this.state.language}</Text>
            </View>

            <View style={{marginTop:hp('2.34%')}}>
              <Text style={styles.titleText}>{I18n.t("clientIdentifier")}</Text>
              <TouchableOpacity style={styles.cameraStyle} onPress={() => this._cameraIconPressed()}>
                <Image source={require('../images/camera-icon.png')}/>
              </TouchableOpacity>
              <TextInput
                placeholder={I18n.t("uuidPlaceHolder")}
                value={this.state.identifier}
                returnKeyType={"done"}
                style={[styles.subtitleText,{width:wp('75%')}]}
                onChangeText={text => this.setState({identifier:text})}
                onSubmitEditing={() => this._saveIdentifierToStorage()}>
              </TextInput>
              <View style={{borderBottomWidth:0.5,borderColor:'rgba(225,227,232,100)',...Platform.select({
                ios: {
                  marginTop:hp('1%')
                },
                android: {
                  marginTop:hp('0%')
                }
              }),width:wp("85%")}}/>
            </View>

            <View style={{marginTop:hp('2.34%')}}>
              <Text style={styles.titleText}>{I18n.t("mqttBroker")}</Text>
              <View style={{flexDirection:'row'}}>
                <TextInput
                  autoCapitalize='none'
                  placeholder={I18n.t("brokerPlaceHolder")}
                  value={this.state.mqtt_broker.split("://")[1]}
                  returnKeyType={"done"}
                  style={[styles.subtitleText,{width:wp('55%')}]}
                  onChangeText={text => this.setState({mqtt_broker:text})}
                  onSubmitEditing={() => this._saveBrokerToStorage()}>
                </TextInput>
                {/*<Text style={styles.subtitleText}>mqtt.eclipse.org</Text>*/}
                {this._renderConnectionState()}
              </View>
            </View>

            {/*
            <View style={{marginTop:hp('3.57%'),flexDirection:'row'}}>
              <Text style={styles.titleText}>Notifications  </Text>
              <LinearGradient useAngle={true} angle={45} colors={this.state.notifications_enabled ? ['#0AC4BA','#2BDA8E'] : ['#FFFFFF','#FFFFFF']} style={[styles.switchStyle,{borderWidth:this.state.notifications_enabled ? 0 : 1.5}]}>
                <Switch
                  disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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

            <View style={styles.seperator}/>*/}

            <View style={{marginTop:hp('3.57%')}}>
              <Text style={styles.titleText}>{I18n.t("help")}</Text>
              <TouchableOpacity onPress={() => Linking.openURL('mailto:contact@steminds.com?subject=[EDUPONICS] Bug report&body=Please describe your bug here, make sure to state your mobile app version and what type of smart phone you have including the OS version you are running.') }>
                <Text style={styles.subtitleText}>{I18n.t("reportBug")}</Text>
              </TouchableOpacity>
            </View>

          </View>

          <TouchableOpacity style={styles.buttonStyle} onPress={() => this._wipeAsyncStorage()}>
            <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.buttonGradientStyle}>
              <Text style={{
                fontSize:hp('1.72%'),
                fontWeight:'bold',
                color:'white',
                ...Platform.select({
                android: {
                  fontFamily:'Roboto'
                }
              })}}>{I18n.t("wipeData")}</Text>
            </LinearGradient>
          </TouchableOpacity>

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
                this.setState({cameraModalVisible: false,identifier:e.data},this._saveIdentifierToStorage);
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
                  onPressOut={() => {this.setState({failedModalVisible:false, identifier:''})}}
                >
                  <FailedModal callBack={(e) => {
                    this.setState({failedModalVisible: false, identifier:''});
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
  },
  titleText:{
    fontSize:hp('1.72%'),
    fontWeight:'bold',
    color:'rgba(197,204,214,100)',
    ...Platform.select({
      android: {
        fontFamily:'Roboto'
      }
    })
  },
  subtitleText:{
    marginTop:hp('1.11%'),
    fontWeight:'600',
    fontSize:hp('1.72%'),
    color:'black',
    ...Platform.select({
      android: {
        fontFamily:'Roboto'
      }
    })
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
    alignSelf:'center',
    top:hp('35%'),
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
  },
  cameraStyle:{
    position:'absolute',
    right:wp('15%'),
    width:24,
    height:24,
    ...Platform.select({
      ios: {
        bottom:hp("0.2%")
      },
      android: {
        bottom:wp("3%")
      }
    }),
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center'
  }
})

export default Settings;
