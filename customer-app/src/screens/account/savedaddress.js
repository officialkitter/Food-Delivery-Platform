/**
 * Buza Food Delivery Mobile Application
 * Core Saved Locations Feed & Address Directory Management View
 * File: src/screens/saveaddress.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, FlatList
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const SAVE_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  dangerRed: '#FF3B30'
};

const INITIAL_SAVED_LOCATIONS = [
  { id: '1', name: 'Home Destination', address: '123 Delivery Street, City Center', unit: 'Apartment 4B', icon: 'home' },
  { id: '2', name: 'Corporate Office', address: '88 Innovation Boulevard, Block 9', unit: 'Suite 201', icon: 'service' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Saved Locations Feed & Address Directory Management View
 * File: src/screens/saveaddress.js (Part 2 of 3)
 */

export default function SaveAddressScreen({
  onSelectAddressCallback,
  onNavigateToAddAddressPress, // Hooks directly over to addaddress.js path
  onBackRoutePress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core State Directories Controllers ---
  const [addressItems, setAddressItems] = useState(INITIAL_SAVED_LOCATIONS);

  // --- Animation Vector References ---
  const layoutFadeAnim = useRef(new Animated.Value(0)).current;
  const backgroundDriftY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(layoutFadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();

    // Constant video-style running vector drift loops tracking vertically
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundDriftY, { toValue: -80, duration: 9500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(backgroundDriftY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  // Structural deletion macro mutator to purge entry from array pools
  const handleRemoveAddressRecord = (targetId) => {
    setAddressItems((prev) => prev.filter(item => item.id !== targetId));
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Saved Locations Feed & Address Directory Management View
 * File: src/screens/saveaddress.js (Part 3 of 3)
 */

  const renderAddressRowCard = ({ item }) => (
    <View style={styles.addressRoundRowPill}>
      <TouchableOpacity 
        style={styles.cardInteractiveArea} 
        activeOpacity={0.75} 
        onPress={() => onSelectAddressCallback?.(item)}
      >
        <View style={styles.providerIconWrapperCircle}>
          <CustomIcon name={item.icon} size={16} color={SAVE_COLORS.textDark} />
        </View>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={styles.addressNameLabel}>{item.name}</Text>
          <Text style={styles.addressDetailLabel} numberOfLines={1}>
            {item.address}{item.unit ? `, ${item.unit}` : ''}
          </Text>
        </View>
      </TouchableOpacity>

      {/* 100% Round Trash Bin Deletion Trigger Key */}
      <TouchableOpacity 
        style={styles.microTrashButtonCircle} 
        activeOpacity={0.7} 
        onPress={() => handleRemoveAddressRecord(item.id)}
      >
        <CustomIcon name="lock" size={14} color={SAVE_COLORS.dangerRed} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="map-pin" size={24} color={SAVE_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onBackRoutePress}>
            <CustomIcon name="arrow-left" size={18} color={SAVE_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.directoryLabelHeading}>FULFILLMENT LOGS</Text>
            <Text style={styles.directoryTitleText}>Saved Addresses</Text>
          </View>
        </View>

        {/* Directory Listings Items Loop Stream Container */}
        <FlatList
          data={addressItems}
          keyExtractor={(item) => item.id}
          renderItem={renderAddressRowCard}
          contentContainerStyle={styles.scrollContentLayout}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyStateBox}>
              <Text style={styles.emptyStateHeading}>No Addresses Saved</Text>
              <Text style={styles.emptyStateCopy}>Your delivery directory is blank. Please register new destination coordinates below.</Text>
            </View>
          }
        />

        {/* Action Panel Lower Controls (100% Round Pill Add Redirect Trigger Key) */}
        <TouchableOpacity style={styles.primaryAddActionButtonPill} activeOpacity={0.85} onPress={onNavigateToAddAddressPress}>
          <CustomIcon name="plus" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryActionButtonText}>Register New Address Coordinates</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: SAVE_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: SAVE_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: SAVE_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SAVE_COLORS.borderLine },
  directoryLabelHeading: { fontSize: 9, fontWeight: '800', color: SAVE_COLORS.textMuted, letterSpacing: 0.5 },
  directoryTitleText: { fontSize: 14, fontWeight: '800', color: SAVE_COLORS.textDark, marginTop: 2 },

  // Scroll Content Directory Feeds
  scrollContentLayout: { paddingVertical: 14, width: '100%' },
  addressRoundRowPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 64, borderRadius: 32, backgroundColor: SAVE_COLORS.surfaceLight, borderWidth: 1, borderColor: SAVE_COLORS.borderLine, paddingHorizontal: 16, marginBottom: 12 },
  cardInteractiveArea: { flexDirection: 'row', alignItems: 'center', flex: 1, height: '100%' },
  providerIconWrapperCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SAVE_COLORS.borderLine, marginRight: 12 },
  addressNameLabel: { fontSize: 14, fontWeight: '800', color: SAVE_COLORS.textDark },
  addressDetailLabel: { fontSize: 11, fontWeight: '500', color: SAVE_COLORS.textMuted, marginTop: 2 },
  microTrashButtonCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SAVE_COLORS.borderLine },

  // Empty State Presentation Styles
  emptyStateBox: { width: '100%', alignItems: 'center', paddingVertical: 64, paddingHorizontal: 16 },
  emptyStateHeading: { fontSize: 16, fontWeight: '800', color: SAVE_COLORS.textDark },
  emptyStateCopy: { fontSize: 13, fontWeight: '500', color: SAVE_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // 100% Round Call-To-Action Controls
  primaryAddActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: SAVE_COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: SAVE_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }
});
