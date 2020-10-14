import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Dimensions, StyleSheet, Platform} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import I18n from "./src/utils/I18n";

// import the routes
import Main from "./src/screens/Main";
import Control from "./src/screens/Control";
import Learn from "./src/screens/Learn";
import Settings from "./src/screens/Settings";

const initialLayout = { width: Dimensions.get('window').width};

const Stack = createStackNavigator();
const InitialStack = createStackNavigator();
const AppStack = createMaterialTopTabNavigator();

function InitialScreens() {
  return (
    <InitialStack.Navigator
      headerMode="none"
      >
      <InitialStack.Screen name="Main" component={Main} />
    </InitialStack.Navigator>
  );
}

function AppScreens() {
  return (
    <AppStack.Navigator
      headerMode="none"
      initialRouteName={Main}
      backBehavior={'none'}
      lazy={true}
      initialLayout={initialLayout}
      style={{backgroundColor:'white'}}
      tabBarOptions={{
        activeTintColor: '#10C8B1',
        inactiveTintColor: '#C5CCD6',
        indicatorStyle: {backgroundColor:'#10C8B1'},
        labelStyle: {
          fontSize: hp("1.8%"),
          fontWeight:'bold',
          ...Platform.select({
          android: {
            fontFamily:'Roboto'
          }
        })
        },
        style:{
          backgroundColor: 'white',
          ...Platform.select({
          ios: {
            marginTop:hp('3.7%')
          },
          android: {
            marginTop:hp('0%'),
            fontFamily:'Roboto'
          }
        })},
      }}
      >
      <AppStack.Screen name={I18n.t("control")} component={Control} />
      {/* <AppStack.Screen name="Learn  " component={Learn} />  */}
      <AppStack.Screen name={I18n.t("settings")} component={Settings} />
    </AppStack.Navigator>
  );
}

export default function app() {
  return (
    <NavigationContainer>
       <Stack.Navigator headerMode="none">
         <Stack.Screen name="InitialStack" component={InitialScreens} />
         <Stack.Screen name="AppStack" component={AppScreens} />
       </Stack.Navigator>
     </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  scene: {
    flex: 1
  }
});
