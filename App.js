import * as React from 'react';
import { View, Text, Dimensions, StyleSheet, Alert} from 'react-native';
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

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case 'main':
        return <Main jumpTo={jumpTo} />;
      case 'control':
        return <Control jumpTo={jumpTo} />;
      case 'learn':
        return <Learn jumpTo={jumpTo} />;
      case 'settings':
        return <Settings jumpTo={jumpTo} />;
    }
};


  const dontRenderTabBar = prpos => (
    <View/>
  )

  const renderTabBar = props => (
    <TabBar
      {...props}
      onTabPress={({ route, preventDefault }) => {
        console.log("route:",route.key)
      }}
      indicatorStyle={{backgroundColor:'#10C8B1'}}
      style={{backgroundColor:'transparent', justifyContent:'center', textAlign:'center'}}
      tabStyle={{backgroundColor:'transparent', width:'auto'}}
      renderLabel={({ route, focused, color }) => route.title != 'Main' ? (
         <Text style={{width:wp('25%'),alignSelf:'center',textAlign:'center',fontSize:hp('1.97%'), fontWeight:'bold', color: route.title == routes[index].title ? 'rgba(16,200,177,100)' : 'rgba(197,204,214,100)'}}>{route.title}  </Text>
      ) : null}
    />
  )
  return (

    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      lazy={true}
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
