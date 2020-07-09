import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

class CameraModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
          introModalVisible:false
        }
    }

    closeModalAfterUse(e) {
      this.props.callBack(e);
    }

    onSuccess = e => {
      console.log(e.data)
      this.closeModalAfterUse(e)
    };

    render() {
        return (
          <View style={styles.container}>
              <QRCodeScanner
                  cameraStyle={{width:wp('88%'),height:hp('35%')}}
                  onRead={this.onSuccess}
                />
                <Text style={{alignSelf:'center',marginBottom:10}}>Scan the QR code</Text>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container:{
    width:wp('88%'),
    height:hp('40%'),
    alignSelf:'center',
    marginTop:180,
    backgroundColor:'white',
    borderColor:'rgba(151,151,151,100)',
    borderWidth:1
  },
  imageBlock:{
    margin:wp('4%'),
    marginTop:hp('3.94%'),
    alignItems:'center',
    height:hp('5.3%'),
    width:wp('8%')
  },
  okayButton:{
    position:'absolute',
    bottom:hp('2.96%'),
    alignSelf:'center',
    width:wp('53.07%'),
    height:hp('5.3%'),
    borderRadius:hp('12.32%'),
    backgroundColor:'rgba(58,210,159,100)',
    justifyContent:'center'
  },
  okayButtonText:{
    alignSelf:'center',
    fontSize:hp('1.72%'),
    fontWeight:'700',
    color:'white'
  },
  markerPin: {
    width: hp('4.08%'),
    height: hp('4.08%')
  },
});

export default CameraModal;
