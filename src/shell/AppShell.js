/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core Structural Application Layout Wrapper
 * src/shell/AppShell.js
 */

import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets, SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { CustomIcon } from '../components/common/CustomIcon';
import { GlobalModalSheet } from './GlobalModalSheet';

const AppShellInner = ({ children, showBottomTabBar = false }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, colors } = useTheme();
  const [activeTab, setActiveTab] = useState('home');

  const handleTabPress = (targetRoute) => {
    setActiveTab(targetRoute);
  };

  // Ultra-minimized responsive bottom inset calculation
  const bottomLayoutInset = showBottomTabBar 
    ? 64 + Math.max(insets.bottom, 8) 
    : Math.max(insets.bottom, 8);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      {/* Forces the screen content to bleed underneath a fully transparent system status bar */}
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Main Viewport Workspace - Absolutely zero top padding. Children fill 100% of screen height */}
      <View style={[styles.mainViewportWorkspace, { paddingBottom: bottomLayoutInset }]}> 
        {children}
      </View>

      {showBottomTabBar && (
        <View style={[styles.horizonDockWrapper, { bottom: Math.max(insets.bottom, 6), backgroundColor: colors.surface, borderColor: colors.accent }]}> 
          <View style={styles.tabCluster}>
            <TouchableOpacity style={styles.dockCell} activeOpacity={0.7} onPress={() => handleTabPress('home')}>
              <CustomIcon name="home" size={18} color={activeTab === 'home' ? colors.primary : colors.accent} />
              {activeTab === 'home' && <View style={[styles.activeIndicatorLine, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockCell} activeOpacity={0.7} onPress={() => handleTabPress('fudcamp')}>
              <CustomIcon name="fudcamp" size={18} color={activeTab === 'fudcamp' ? colors.primary : colors.accent} />
              {activeTab === 'fudcamp' && <View style={[styles.activeIndicatorLine, { backgroundColor: colors.secondary }]} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockCell} activeOpacity={0.7} onPress={() => handleTabPress('service')}>
              <CustomIcon name="service" size={18} color={activeTab === 'service' ? colors.primary : colors.accent} />
              {activeTab === 'service' && <View style={[styles.activeIndicatorLine, { backgroundColor: colors.secondary }]} />}
            </TouchableOpacity>
          </View>

          <View style={styles.centerHorizonAnchor}>
            <View style={[styles.outerCutoutRing, { backgroundColor: colors.surface, borderColor: colors.accent }]}> 
              <TouchableOpacity style={[styles.centralActionSphere, { backgroundColor: colors.accent }]} activeOpacity={0.85} onPress={() => handleTabPress('orders')}>
                <CustomIcon name="delivery-scooter" size={20} color={colors.surface} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tabCluster}>
            <TouchableOpacity style={styles.dockCell} activeOpacity={0.7} onPress={() => handleTabPress('favorite')}>
              <CustomIcon name="heart" size={18} color={activeTab === 'favorite' ? colors.primary : colors.accent} />
              {activeTab === 'favorite' && <View style={[styles.activeIndicatorLine, { backgroundColor: colors.secondary }]} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockCell} activeOpacity={0.7} onPress={() => handleTabPress('nearby')}>
              <CustomIcon name="map-pin" size={18} color={activeTab === 'nearby' ? colors.primary : colors.accent} />
              {activeTab === 'nearby' && <View style={[styles.activeIndicatorLine, { backgroundColor: colors.secondary }]} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.dockCell} activeOpacity={0.7} onPress={() => handleTabPress('account')}>
              <CustomIcon name="user-profile" size={18} color={activeTab === 'account' ? colors.primary : colors.accent} />
              {activeTab === 'account' && <View style={[styles.activeIndicatorLine, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <GlobalModalSheet />
    </View>
  );
};

export const AppShell = ({ children, showBottomTabBar = false }) => {
  return (
    <SafeAreaProvider>
      <AppShellInner showBottomTabBar={showBottomTabBar}>{children}</AppShellInner>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainViewportWorkspace: {
    flex: 1,
  },
  horizonDockWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 100,
  },
  tabCluster: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: '100%',
  },
  dockCell: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  activeIndicatorLine: {
    position: 'absolute',
    bottom: -3,
    width: 12,
    height: 2.5,
    borderRadius: 1.25,
  },
  centerHorizonAnchor: {
    width: 58,
    height: 58,
    top: -10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  outerCutoutRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centralActionSphere: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
