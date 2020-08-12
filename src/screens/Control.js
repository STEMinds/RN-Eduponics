//
//  Control.js
//
//  Created by Roni Gorodetsky.
//  Copyright © 2020 STEMinds. All rights reserved.
//

import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,StatusBar,Platform,Animated,Modal,ScrollView,Alert} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Spinner from 'react-native-loading-spinner-overlay';
import MQTT from 'sp-react-native-mqtt';
import FirstTimeModal from "../components/FirstTimeModal";
import I18n from "../utils/I18n";

function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

// Create a client instance
class Control extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        welcomeMessage:"",
        spinner:false,
        sample:true,
        identifier:'',
        mqtt_client:null,
        mqtt_subscribed:false,
        firstTimeModalShow:false,
        mode:"soil",
        environment:{
          temp:null,
          humidity:null,
          sunlight:null,
          water_quantity:null
        },
        connected:false,
        sensors:{
          "A":{
          "id":null,
          "name":"N/A",
          "enabled":false,
          "moisture":"0%"
        },"B":{
          "id":null,
          "name":"N/A",
          "enabled":false,
          "moisture":"0%"
        },"C":{
          "id":null,
          "name":"N/A",
          "enabled":false,
          "moisture":"0%"
        },"D":{
          "id":null,
          "name":"N/A",
          "enabled":false,
          "moisture":"0%"
        }}
      }
      this.props.navigation.addListener(
        'focus',
        payload => {
          console.log("Control is focused")
          this._setWelcomeMessage()
          this.updateStorage()
        }
      );
    }

    componentDidMount() {
      setTimeout(() => {
        // check if spinner still rolling
        if(this.state.spinner){
          this.setState({spinner: false});
          // can't fetch mqtt data, something is wrong
          setTimeout(() => {
              Alert.alert(I18n.t("unableToLoadTitle"),I18n.t("unableToLoadContent"));
          }, 100);
        }
      }, 15000);
    }

    _setWelcomeMessage(){
      var today = new Date();
      var time = today.getHours()
      var sentence = ""
      if(time >= 22 || time < 5){
        // good night
        sentence = I18n.t("goodNight");
      }
      if(time >= 5 && time < 12){
        // good morning
        sentence = I18n.t("goodMorning");
      }
      if(time >= 12 && time < 14){
        // good noon
        sentence = I18n.t("goodNoon");
      }
      if(time >= 14 && time < 18){
        // good after-noon
        sentence = I18n.t("goodAfternoon");
      }
      if(time > 18 && time < 22){
        // good evening
        sentence = I18n.t("goodEvening");
      }
      this.setState({welcomeMessage:sentence})
    }

    async updateStorage(){
      try {
        const value = await AsyncStorage.getItem('@identifier')
        if(value !== null) {
          // check if the identifier we currently have is same as value
          if(value != this.state.identifier && this.state.identifier != ''){
            // the identifier was changed in settings
            // close the client
            //this.mqtt_client.close()
            // update settings
            this.setState({
                identifier: value,
                mqtt_client:null,
                mqtt_subscribed: false
            }, () => {
                // set new mqtt client
                this._setupMQTT()
            });
          }else{
            // value previously stored, set it
            this.setState({
                identifier: value,
                firstTimeModalShow: false,
            }, () => {
                // set new mqtt client
                this._setupMQTT()
            });
          }
        }else{
          // value is empty, show the modal
          this.setState({firstTimeModalShow:true})
        }
      } catch (e) {
        // saving error
        console.log("error saving identifier",e)
      }
    }

    async updateSensorsData (client){
      await client.publish(this.state.identifier + '/plants/soil', '{"action":"get","status":"pending"}', 0, false);
    }

    async updateEnvironmentalData (client){
      await client.publish(this.state.identifier + '/plants/environment', '{"action":"get","status":"pending"}', 0, false);
    }

    async _setupMQTT(){
      if(this.state.mqtt_client == null){
        /* create mqtt client */
        var client = await MQTT.createClient( {
          //uri: 'mqtt://mqtt.eclipse.org:1883',
          uri: 'mqtts://mqtt.steminds.com:8883',
          clientId: guidGenerator()
        })
        /* connect to client */
        await client.connect();
        // set the client into state
        this.setState({mqtt_client:client,spinner:true});
      }
      /* make sure client created successfully */
      if(this.state.mqtt_client != null){
        // make sure we are not subscribed already
        if(this.state.mqtt_subscribed == false && this.state.identifier != ''){
          client.on('closed', function() {
            console.log('mqtt.event.closed');
          }.bind(this));

          client.on('error', function(msg) {
            console.log('mqtt.event.error', msg);
          }.bind(this));

          client.on('message', function(msg) {
            /* Manage plants soil data given from the Raspberry Pi */
            if(msg.topic == this.state.identifier + "/plants/soil"){
              var sensor = JSON.parse(msg.data)
              if(!sensor.hasOwnProperty("action")){
                // turn int into boolean
                sensor["enabled"] = !!+sensor["enabled"]
                // check if connected before
                if(!this.state.connected){
                  // first time, make new array
                  var existing_sensors = {}
                }else{
                  // not first time, take existing array
                  var existing_sensors = this.state.sensors
                }
                // add or update sensors
                existing_sensors[sensor["id"]] = sensor
                this.setState({sensors:existing_sensors, connected:true,spinner:false})
                if(this.state.sample == true){
                  this.updateEnvironmentalData(client);
                  this.setState({sample:false})
                }
              }
            }
            /* Manage plants environmental data given from the Raspberry Pi */
            else if(msg.topic == this.state.identifier + "/plants/environment"){
              var data = JSON.parse(msg.data)
              if(!data.hasOwnProperty("action")){
                this.setState({environment:data})
                if(this.state.sample == true){
                  this.updateSensorsData(client);
                  this.setState({sample:false})
                }
              }

            }
            /* Manage soil plants watering commands response from the Raspberry Pi */
            else if(msg.topic == this.state.identifier + "/plants/water"){
              var data = JSON.parse(msg.data)
              if(data.status == "ok"){
                var plant_key = data.key
                var sensors = this.state.sensors
                sensors[plant_key].enabled = true
                this.setState(sensors)
              }
            }
          }.bind(this));

          client.on('connect', async function() {
            console.log('connected');
            /* subscribe to topics */
            client.subscribe(this.state.identifier + '/plants/soil', 0);
            client.subscribe(this.state.identifier + '/plants/environment', 0);
            client.subscribe(this.state.identifier + '/plants/water', 0);
            // update environmental data updates the environment first
            // once it's finished, it will send signal to update the soil moisture sensors
            this.updateEnvironmentalData(client);
            this.setState({mqtt_subscribed:true})
          }.bind(this));
        }
      }
    }

    _renderSoilSensors(){
      var container = Object.keys(this.state.sensors).map(key =>
      <View style={styles.soilMoistureBox} key={key}>
        <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={[styles.absolute,{borderRadius:6,width:this.state.sensors[key].moisture}]}/>
        <Image source={require('../images/water_drop.png')} style={styles.waterDrop}/>
        <View style={{flexDirection:'column',marginLeft:wp('2.67%'),alignSelf:'center'}}>
          <Text style={styles.plantNameText}>{this.state.sensors[key].name}</Text>
          <Text style={styles.plantSoilText}>{I18n.t("soilMoisture")}</Text>
        </View>
        <Text style={styles.soilQuantityText}>{this.state.sensors[key].moisture}</Text>
        <TouchableOpacity style={styles.powerButton} disabled={!this.state.sensors[key].enabled} onPress={() => this._givePlantWater(key)}>
          <LinearGradient useAngle={true} angle={45} colors={this.state.sensors[key].enabled ? ['#0AC4BA','#2BDA8E'] : ['#ABC2E1','#ABC2E1']} style={[styles.absolute,{
              borderBottomRightRadius: I18n.isRTL ? 0 : 6,
              borderTopRightRadius: I18n.isRTL ? 6 : 0,
              borderTopLeftRadius: I18n.isRTL ? 0 : 6,
              borderBottomLeftRadius: I18n.isRTL ? 6 : 0}]}/>
          <Image source={require('../images/power_button.png')} style={{alignSelf:'center',tintColor: this.state.sensors[key].enabled ? 'white' : '#4D72A3', opacity: this.state.sensors[key].enabled ? 1 : 0.6}}/>
        </TouchableOpacity>
      </View>)
      return container
    }

    async _givePlantWater(key){
      await this.state.mqtt_client.publish(this.state.identifier + '/plants/water', '{"key":"' + key + '","status":"pending"}', 0, false);
      // disable sensor till we recieve feedback to enable it back
      var sensors = this.state.sensors
      sensors[key].enabled = false
      this.setState(sensors);
    }

    render() {
        return (
          <View style={styles.absolute}>
            <StatusBar
              backgroundColor="white"
              barStyle="dark-content"
            />
            <Spinner
              visible={this.state.spinner}
              textContent={I18n.t("loadingData")}
              textStyle={styles.spinnerTextStyle}
            />
            <LinearGradient colors={['#FFFFFF','#D4E5F8']} style={styles.absolute}/>
            <View style={styles.container}>
              <Image source={require('../images/flower_illustration.png')} style={styles.flowerIllustration} resizeMode="contain"/>

              <Text style={styles.introText}>{this.state.welcomeMessage}</Text>

              <View style={[styles.dataContainer,{marginTop:hp('2%')}]}>
                <Text style={styles.infoTitle}>{I18n.t("waterQauntity")}</Text>
                <Text style={styles.infoSubtitle}>{this.state.environment.water_quantity == null ? "N/A" : this.state.environment.water_quantity}</Text>
              </View>

              <View style={styles.dataContainer}>
                <Text style={styles.infoTitle}>{I18n.t("temperature")}</Text>
                <Text style={styles.infoSubtitle}>{this.state.environment.temp == null ? "N/A" : this.state.environment.temp + "℃"}</Text>
              </View>

              <View style={styles.dataContainer}>
                <Text style={styles.infoTitle}>{I18n.t("humidity")}</Text>
                <Text style={styles.infoSubtitle}>{this.state.environment.humidity == null ? "N/A" : this.state.environment.humidity + "%"}</Text>
              </View>

              <View>
                <Text style={styles.infoTitle}>{I18n.t("sunlight")}</Text>
                <Text style={styles.infoSubtitle}>{this.state.environment.sunlight == null ? "N/A" : this.state.environment.sunlight + "lx"}</Text>
              </View>

              <Text style={styles.controlText}>{I18n.t("control")}</Text>
              <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.controlLinear}/>

              <View style={styles.soilMoistureContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {this._renderSoilSensors()}
                </ScrollView>
              </View>
          </View>

          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.firstTimeModalShow}
            onRequestClose={() => {this.setState({firstTimeModalShow:false})}}>
            <TouchableOpacity
              style={[styles.absolute,{backgroundColor: 'rgba(100,100,100, 0.5)'}]}
              activeOpacity={1}
              onPressOut={() => {this.setState({firstTimeModalShow:false})}}
            >
              <FirstTimeModal callBack={() => {
                this.setState({firstTimeModalShow: false});
                this.props.navigation.navigate('AppStack', { screen: I18n.t("settings") })
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
  spinnerTextStyle:{
    color:'white'
  },
  flowerIllustration:{
    position:'absolute',
    right: I18n.isRTL ? wp('-5.5%') : wp('-13.8%'),
    transform: I18n.isRTL ? [{rotateY: '180deg'}] : [],
    top:hp('-3%'),
    //width: wp('82.13'),
    height: hp('49%')
  },
  container:{
    left:wp('8%'),
    alignItems: I18n.isRTL ? null : 'flex-start'
  },
  introText:{
    textAlign: I18n.isRTL ? 'left' : 'right',
    marginTop:hp('2%'),
    fontSize:hp('3.2%'),
    fontWeight:'bold'
  },
  infoTitle:{
    textAlign: I18n.isRTL ? 'left' : 'right',
    fontSize:hp('1.48%'),
    opacity:0.4
  },
  infoSubtitle:{
    alignSelf: I18n.isRTL ? null : 'flex-start',
    textAlign: I18n.isRTL ? 'left' : 'right',
    marginTop:hp('1.23%'),
    fontSize:hp('2.22%'),
    fontWeight:'600'
  },
  dataContainer:{
    alignItems: I18n.isRTL ? null : 'flex-end',
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
    height:hp('40.32%'),
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
    textAlign: 'left',
    fontSize:hp('1.72%'),
    fontWeight:'bold',
    color:'white',
    marginBottom:hp('0.25%')
  },
  plantSoilText:{
    textAlign: I18n.isRTL ? 'right' : 'left',
    opacity:0.7,
    fontSize:hp('1.48%'),
    color:'white'
  },
  powerButton:{
    position:'absolute',
    justifyContent:'center',
    borderWidth:1,
    borderColor:'white',
    borderBottomRightRadius: I18n.isRTL ? 6 : 6,
    borderBottomLeftRadius: I18n.isRTL ? 0 : 0,
    borderTopLeftRadius: I18n.isRTL ? 6 : 6,
    borderTopRightRadius: I18n.isRTL ? 0 : 0,
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
