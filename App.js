import * as React from 'react';
import { View, Text, Dimensions, StyleSheet, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

// import the routes
import Main from "./src/screens/Main";
import Control from "./src/screens/Control";
import Learn from "./src/screens/Learn";
import Settings from "./src/screens/Settings";

const initialLayout = { width: Dimensions.get('window').width};

export default function navBar() {
  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: 'main', title: 'Main'},
    { key: 'control', title: 'Control' },
    { key: 'learn', title: 'Learn' },
    { key: 'settings', title: 'Settings' },
  ]);

  const [routesNew] = React.useState([
    { key: 'control', title: 'Control' },
    { key: 'learn', title: 'Learn' },
    { key: 'settings', title: 'Settings' },
  ]);


  const renderScene = SceneMap({
    main: Main,
    control: Control,
    learn: Learn,
    settings: Settings
  });

  const renderSceneTwo = SceneMap({
    control: Control,
    learn: Learn,
    settings: Settings
  });

  const dontRenderTabBar = prpos => (
    <View/>
  )

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor:'#10C8B1'}}
      style={{backgroundColor:'transparent', justifyContent:'center', textAlign:'center'}}
      tabStyle={{backgroundColor:'transparent', width:'auto'}}
      renderLabel={({ route, focused, color }) => route.title != 'Main' ? (
         <Text style={{width:wp('25%'),alignSelf:'center',textAlign:'center',fontSize:hp('1.97%'), fontWeight:'bold', color: route.title == routes[index].title ? 'rgba(16,200,177,100)' : 'rgba(197,204,214,100)'}}>{route.title}  </Text>
      ) : null}
    />
  )

      console.log(index,routes);
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={styles.topNavBar}
      renderTabBar={index == 0 ? dontRenderTabBar : renderTabBar}
      swipeEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1
  },
  topNavBar:{
    ...Platform.select({
      ios: {
        marginTop:hp('3.7%')
      },
      android: {
        marginTop:hp('0%')
      }
    })
  },
});
