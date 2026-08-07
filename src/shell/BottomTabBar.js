import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Core Application Screen Viewport Layer Mappings
import Home from '../screens/market/home';
import FudCampFeed from '../screens/auth/comingsoon';
import Services from '../screens/market/services';
import Favorites from '../screens/market/favorite';
import NearbyMap from '../screens/market/nearbymap';
import OrderLedger from '../screens/track/myorder';
import Account from '../screens/account/account';

const Tab = createBottomTabNavigator();

export default function BottomTabAppNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{ headerShown: false, contentStyle: styles.tabContent }}
      tabBar={() => null}
    >
      {/* Core Integrated Tab Screen Registry */}
      <Tab.Screen name="home" component={Home} />
      <Tab.Screen name="fudcamp" component={FudCampFeed} />
      <Tab.Screen name="service" component={Services} />
      <Tab.Screen name="favorite" component={Favorites} />
      <Tab.Screen name="nearby" component={NearbyMap} />
      <Tab.Screen name="orders" component={OrderLedger} />
      <Tab.Screen name="account" component={Account} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    paddingBottom: 96
  }
});
