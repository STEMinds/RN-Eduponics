import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import I18n from "../utils/I18n";

class SuccessModal extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    closeModalAfterUse() {
      this.props.callBack();
    }

    onSuccess = e => {
      console.log(e.data)
      this.closeModalAfterUse(e)
    };

    render() {
        return (
          <View style={styles.container}>
            <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.linearStyle}>
              <LinearGradient useAngle={true} angle={45} colors={['#C5FFE1','#FEFFFF']} style={{width:hp("8.29%"),height:hp("8.29%"),borderRadius:100,alignItems:'center',justifyContent:'center'}}>
                <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={{width:hp("4.51%"),height:hp("4.51%"),borderRadius:100,alignItems:'center',justifyContent:'center'}}>
                  <Image style={styles.logoGrey} source={require('../images/success.png')}/>
                </LinearGradient>
              </LinearGradient>
            </LinearGradient>
            <Text style={styles.sucessText}>
                {I18n.t("success")}
            </Text>
            <Text style={styles.connectionEstablishedText}>
                {I18n.t("connectionEstablished")}{"\n"}
            </Text>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => this.closeModalAfterUse()}>
              <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={styles.closeModalLinear}>
                <Text style={styles.awesomeText}>{I18n.t("awesome")}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        );
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
  container:{
    width:wp("62.67%"),
    height:hp("35.37%"),
    backgroundColor:'#FFFFFF',
    borderBottomRightRadius:57.6,
    borderTopLeftRadius:57.6,
    borderBottomLeftRadius:7.2,
    borderTopRightRadius:7.2,
    alignSelf:'center',
    marginTop:hp('21.95%'),
    borderColor:'rgba(151,151,151,100)',
    alignItems:'center'
  },
  linearStyle:{
    width:wp("62.67%"),
    height:hp("13.17%"),
    borderBottomRightRadius:56,
    borderTopLeftRadius:57.6,
    borderTopRightRadius:7.2,
    alignItems:'center',
    justifyContent:'center'
  },
  awesomeText:{
    fontSize:hp("1.71%"),
    fontWeight:'bold',
    color:'white',
    ...Platform.select({
      android: {
        fontFamily:'Roboto'
      }
    })
  },
  closeModalButton:{
    marginTop:hp("2.56%"),
    width:wp("48%"),
    height:hp("5.37%"),
    borderRadius:22,
    alignSelf:'center'
  },
  closeModalLinear:{
    width:wp("48%"),
    height:hp("5.37%"),
    borderRadius:22,
    alignItems:'center',
    justifyContent:'center'
  },
  connectionEstablishedText:{
    marginTop:hp("1.22%"),
    fontSize:hp("1.71%"),
    opacity:0.8,
    justifyContent:'center',
    textAlign:'center',
    ...Platform.select({
      android: {
        fontFamily:'Roboto'
      }
    })
  },
  sucessText:{
    fontSize:hp('2.44%'),
    fontWeight:'bold',
    marginTop:hp("1.22%"),
    ...Platform.select({
      android: {
        fontFamily:'Roboto'
      }
    })
  }
});

export default SuccessModal;
