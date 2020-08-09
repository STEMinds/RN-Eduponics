import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import I18n from "../utils/I18n";

class FirstTimeModal extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    closeModalAfterUse() {
      this.props.callBack();
    }

    render() {
        return (
          <View style={styles.container}>
            <Text style={styles.title}>{I18n.t('welcome')}</Text>
            <Image source={require('../images/intro_image.png')} style={styles.introImage} resizeMode="contain"/>
            <Text style={styles.contentText}>
              {I18n.t('welcomeText')}
            </Text>
            <TouchableOpacity style={styles.letsGoButton} onPress={() => this.closeModalAfterUse()}>
              <LinearGradient useAngle={true} angle={45} colors={['#0AC4BA','#2BDA8E']} style={[styles.absolute,{borderRadius:22}]}/>
              <Text style={styles.letsGoText}>{I18n.t('letsGo')}</Text>
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
    width:wp('74.67%'),
    height:hp('50.54%'),
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
  title:{
    fontSize:hp('3.17%'),
    fontWeight:'bold',
    marginTop:hp('2.8%')
  },
  introImage:{
    marginTop:hp('4.51%'),
    height:hp('20.73%'),
    width:wp('48.27%')
  },
  contentText:{
    marginTop:hp('0.22%'),
    fontSize:hp('1.71%'),
    opacity:0.8,
    color:"rgba(49,53,66,100)",
    justifyContent:'center'
  },
  letsGoButton:{
    marginTop:hp('1.93%'),
    width:wp('48%'),
    height:hp('5.37%'),
    borderRadius:22,
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
  }
});

export default FirstTimeModal;
