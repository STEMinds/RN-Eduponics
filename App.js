import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Dimensions, StyleSheet, Alert} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

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
      sceneContainerStyle={styles.sceneContainerStyle}
      tabBarOptions={{
        style:{backgroundColor: 'transparent', ...Platform.select({
          ios: {
            marginTop:hp('3.7%')
          },
          android: {
            marginTop:hp('0%')
          }
        })},
      }}
      >
      <AppStack.Screen name="Control" component={Control} />
      <AppStack.Screen name="Learn" component={Learn} />
      <AppStack.Screen name="Settings" component={Settings} />
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
  },
  topNavBar:{
    ...Platform.select({
      ios: {
        //marginTop:hp('3.7%')
      },
      android: {
        marginTop:hp('0%')
      }
    })
  },
  tabStyle:{
    backgroundColor:'red'
  }
});
