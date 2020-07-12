import React, {Component} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';

class CameraModal extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    closeModalAfterUse(e) {
      this.props.callBack(e);
    }

    onSuccess = e => {
      this.closeModalAfterUse(e)
    };

    render() {
        return (
          <View style={styles.container}>
              <QRCodeScanner
                  cameraStyle={{width:wp("84%"),height:wp("84%")}}
                  containerStyle={{width:wp("84%"),height:wp("84%")}}
                  showMarker={true}
                  markerStyle={{borderColor:'#0FC7B3',borderWidth:1}}
                  onRead={this.onSuccess}
                />
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container:{
    width:wp("84%"),
    height:wp("84%"),
    alignSelf:'center',
    marginTop:180,
    backgroundColor:'white',
    borderColor:'rgba(151,151,151,100)',
    borderWidth:1
  }
});

export default CameraModal;
