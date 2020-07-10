//
//  Control.js
//
//  Created by Roni Gorodetsky.
//  Copyright © 2020 STEMinds. All rights reserved.
//

import React from 'react'
import {View,Text,StyleSheet,TouchableOpacity,Image,StatusBar,Platform,Animated,Modal} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import MQTT from 'sp-react-native-mqtt';

import FirstTimeModal from "../components/FirstTimeModal";

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
        mqtt_client:null,
        firstTimeModalShow:true,
        mode:"soil",
        environment:{
          temp:null,
          humidity:null,
          sunlight:null,
          water_quantity:null
        },
        connected:false,
        sensors:{"A":{
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
      //this.client = this._setupMQTT()
      this.props.navigation.addListener(
        'focus',
        payload => {
          console.log('Control is focused');
        }
      );
    }

    componentDidMount() {
      // check if first time, if it is, show modal
      this.setState({trial:'tested'})
    }

    toggleAnimation = () =>{
      Animated.timing(this.state.animationValue, {
        toValue : 50,
        timing : 1500
      })
    }

    async _setupMQTT(){
      /* create mqtt client */
      var client = await MQTT.createClient( {
        uri: 'mqtt://mqtt.eclipse.org:1883',
        clientId: guidGenerator()
      })
      /* make sure client created successfully */
      if(client){
        client.on('closed', function() {
          console.log('mqtt.event.closed');
        }.bind(this));

        client.on('error', function(msg) {
          console.log('mqtt.event.error', msg);
        }.bind(this));

        client.on('message', function(msg) {
          /* Manage plants soil data given from the Raspberry Pi */
          if(msg.topic == "plants/soil"){
            var sensor = JSON.parse(msg.data)
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
            this.setState({sensors:existing_sensors, connected:true})
          }
          /* Manage plants environmental data given from the Raspberry Pi */
          else if(msg.topic == "plants/environment"){
            var data = JSON.parse(msg.data)
            this.setState({environment:data})
          }
          /* Manage soil plants watering commands response from the Raspberry Pi */
          else if(msg.topic == "plants/water"){
            var data = JSON.parse(msg.data)
            if(data.status == "OK"){
              var plant_key = data.key
              var sensors = this.state.sensors
              sensors[plant_key].enabled = true
              this.setState(sensors)
            }
          }
        }.bind(this));

        client.on('connect', function() {
          console.log('connected');
          /* subscribe to topics */
          client.subscribe('plants/soil', 0);
          client.subscribe('plants/environment', 0);
          client.subscribe('plants/water', 0);
        });

        /* connect to client */
        await client.connect();
        this.setState({mqtt_client:client})
      }
    }

    _renderSoilSensors(){
      var container = Object.keys(this.state.sensors).map(key =>
      <View style={styles.soilMoistureBox} key={key}>
        <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={[styles.absolute,{borderRadius:6,width:this.state.sensors[key].moisture}]}/>
        <Image source={require('../images/water_drop.png')} style={styles.waterDrop}/>
        <View style={{flexDirection:'column',marginLeft:wp('2.67%'),alignSelf:'center'}}>
          <Text style={styles.plantNameText}>{this.state.sensors[key].name}</Text>
          <Text style={styles.plantSoilText}>Soil moisture</Text>
        </View>
        <Text style={styles.soilQuantityText}>{this.state.sensors[key].moisture}</Text>
        <TouchableOpacity style={styles.powerButton} disabled={!this.state.sensors[key].enabled} onPress={() => this._givePlantWater(key)}>
          <LinearGradient useAngle={true} angle={45} colors={this.state.sensors[key].enabled ? ['#0AC4BA','#2BDA8E'] : ['#ABC2E1','#ABC2E1']} style={[styles.absolute,{borderBottomRightRadius:6,borderTopLeftRadius:6}]}/>
          <Image source={require('../images/power_button.png')} style={{alignSelf:'center',tintColor: this.state.sensors[key].enabled ? 'white' : '#4D72A3', opacity: this.state.sensors[key].enabled ? 1 : 0.6}}/>
        </TouchableOpacity>
      </View>)
      return container
    }

    async _givePlantWater(key){
      await this.state.mqtt_client.publish('plants/water', '{"key":"' + key + '","status":"pending"}', 0, false);
      // disable sensor till we recieve feedback to enable it back
      var sensors = this.state.sensors
      sensors[key].enabled = false
      this.setState(sensors);
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
                <Text style={styles.infoSubtitle}>{this.state.environment.water_quantity == null ? "N/A" : this.state.environment.water_quantity}</Text>
              </View>

              <View style={styles.dataContainer}>
                <Text style={styles.infoTitle}>Temperature</Text>
                <Text style={styles.infoSubtitle}>{this.state.environment.temp == null ? "N/A" : this.state.environment.temp + "℃"}</Text>
              </View>

              <View style={styles.dataContainer}>
                <Text style={styles.infoTitle}>Humidity</Text>
                <Text style={styles.infoSubtitle}>{this.state.environment.humidity == null ? "N/A" : this.state.environment.humidity + "%"}</Text>
              </View>

              <View>
                <Text style={styles.infoTitle}>Sunlight</Text>
                <Text style={styles.infoSubtitle}>{this.state.environment.sunlight == null ? "N/A" : this.state.environment.sunlight + "lx"}</Text>
              </View>

              <Text style={styles.controlText}>Control</Text>
              <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.controlLinear}/>

              <View style={styles.soilMoistureContainer}>

              {this._renderSoilSensors()}

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
              <FirstTimeModal callBack={(e) => {
                this.setState({firstTimeModalShow: false});
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
