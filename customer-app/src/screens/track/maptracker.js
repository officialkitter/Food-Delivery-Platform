/**
 * Buza Food Delivery Mobile Application
 * Core Interactive Logistics Route Map Tracking View
 * File: src/screens/maptracker.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const MAP_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  mapGrid: '#F0F6F6', pathSuccess: '#4CD964'
};
/**
 * Buza Food Delivery Mobile Application
 * Core Interactive Logistics Route Map Tracking View
 * File: src/screens/maptracker.js (Part 2 of 3)
 */

export default function MapTrackerScreen({
  courierName = "Alex K.",
  courierPlate = "TX-894-BZ",
  destinationAddress = "City Center, Block 4",
  onCallCourierPress,
  onMessageCourierPress,
  onBackPress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Animation Refs ---
  const fadeLayoutAnim = useRef(new Animated.Value(0)).current;
  const backgroundDriftY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;
  
  // Simulated driver tracking coordination loops cross navigation grid
  const driverTransitAnimX = useRef(new Animated.Value(0)).current;
  const driverTransitAnimY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeLayoutAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    // Constant video-style running vector drift loops
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundDriftY, { toValue: -80, duration: 10000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(backgroundDriftY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();

    // Continuous map routing movement simulation looping across coordinate axis
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(driverTransitAnimX, { toValue: DEVICE_WIDTH * 0.25, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(driverTransitAnimY, { toValue: -DEVICE_HEIGHT * 0.1, duration: 6000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
        ]),
        Animated.parallel([
          Animated.timing(driverTransitAnimX, { toValue: DEVICE_WIDTH * 0.45, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(driverTransitAnimY, { toValue: -DEVICE_HEIGHT * 0.18, duration: 5000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })
        ]),
        Animated.delay(2000),
        Animated.parallel([
          Animated.timing(driverTransitAnimX, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(driverTransitAnimY, { toValue: 0, duration: 0, useNativeDriver: true })
        ])
      ])
    ).start();
  }, []);
/**
 * Buza Food Delivery Mobile Application
 * Core Interactive Logistics Route Map Tracking View
 * File: src/screens/maptracker.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Modern High-Fidelity Geometric Virtual Route Grid Layout Canvas */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: MAP_COLORS.mapGrid }]} pointerEvents="none">
        {/* Abstract vector architectural coordinate layout paths lines */}
        <View style={styles.vectorRoutePathLine} />
        <View style={[styles.vectorRoutePathLine, { top: '45%', transform: [{ rotate: '-25deg' }] }]} />
        <View style={[styles.vectorRoutePathLine, { top: '65%', transform: [{ rotate: '40deg' }] }]} />
        
        {/* Dynamic Flowing Visual Asset Tracking Loops Layer */}
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="delivery-scooter" size={24} color={MAP_COLORS.primary + '15'} />
        </Animated.View>

        {/* Route Target Pin Node - Endpoint Destination */}
        <View style={[styles.mapMarkerNodeAnchor, { top: '35%', left: '70%' }]}>
          <View style={styles.destinationPinRippleCircle} />
          <View style={styles.destinationPinCoreCircle}>
            <CustomIcon name="map-pin" size={14} color="#FFFFFF" />
          </View>
        </View>

        {/* Active Moving Driver Tracking Dot Indicator Layer */}
        <Animated.View style={[styles.driverMarkerTrackingNode, { top: '62%', left: '25%', transform: [{ translateX: driverTransitAnimX }, { translateY: driverTransitAnimY }] }]}>
          <View style={styles.driverDotInnerCoreCircle}>
            <CustomIcon name="delivery-scooter" size={14} color="#FFFFFF" />
          </View>
        </Animated.View>
      </View>

      {/* Floating Floating UI HUD Interface Layers Overlay */}
      <Animated.View style={[styles.viewportHudLayout, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: fadeLayoutAnim }]}>
        
        {/* Header Ribbon Element: Round Back Redirection Anchor */}
        <TouchableOpacity style={styles.roundHeaderActionButton} onPress={onBackPress} activeOpacity={0.8}>
          <CustomIcon name="arrow-left" size={18} color={MAP_COLORS.textDark} />
        </TouchableOpacity>

        {/* Bottom Floating Delivery Status Card Panel Container */}
        <View style={styles.bottomCourierStatusCard}>
          <View style={[styles.rowSpaceBetween, { borderBottomWidth: 1, borderBottomColor: MAP_COLORS.borderLine, paddingBottom: 14, marginBottom: 14 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.courierNameHeaderTitle}>{courierName}</Text>
              <Text style={styles.vehiclePlateSubtitleText}>Vehicle Plate: {courierPlate}</Text>
              <Text style={styles.destinationTextCopy} numberOfLines={1}>Route: {destinationAddress}</Text>
            </View>
            <View style={styles.profileCircleIconWrapper}>
              <CustomIcon name="profile" size={24} color={MAP_COLORS.textDark} />
            </View>
          </View>

          {/* Interactive Direct Communication Option Panel (100% Round Circle Keys) */}
          <View style={styles.rowSpaceBetween}>
            <TouchableOpacity style={styles.communicationActionButtonPill} activeOpacity={0.85} onPress={onMessageCourierPress}>
              <CustomIcon name="message" size={16} color={MAP_COLORS.textDark} style={{ marginRight: 8 }} />
              <Text style={styles.actionBtnLabelText}>Text Courier</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.communicationActionButtonPill, { backgroundColor: MAP_COLORS.primary, borderColor: MAP_COLORS.primary }]} activeOpacity={0.85} onPress={onCallCourierPress}>
              <CustomIcon name="phone" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={[styles.actionBtnLabelText, { color: '#FFFFFF' }]}>Call Voice Center</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1 },
  viewportHudLayout: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', alignItems: 'flex-start' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Geometric Vector Route Matrix Rules
  vectorRoutePathLine: { position: 'absolute', width: DEVICE_WIDTH * 1.5, height: 4, backgroundColor: '#E2E8F0', left: '-20%', top: '50%', transform: [{ rotate: '15deg' }] },
  mapMarkerNodeAnchor: { position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 40, height: 40 },
  destinationPinRippleCircle: { position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255, 127, 80, 0.15)', borderWidth: 1, borderColor: 'rgba(255, 127, 80, 0.25)' },
  destinationPinCoreCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: MAP_COLORS.primary, alignItems: 'center', justifyContent: 'center', zIndex: 10, shadowColor: MAP_COLORS.textDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  driverMarkerTrackingNode: { position: 'absolute', width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  driverDotInnerCoreCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: MAP_COLORS.textDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FFFFFF', shadowColor: MAP_COLORS.textDark, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 6 },

  // Floating Overlays HUD Panels Layout Rules
  roundHeaderActionButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: MAP_COLORS.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: MAP_COLORS.borderLine, shadowColor: MAP_COLORS.textDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  bottomCourierStatusCard: { width: '100%', backgroundColor: MAP_COLORS.background, borderRadius: 20, borderWidth: 1, borderColor: MAP_COLORS.borderLine, padding: 18, shadowColor: MAP_COLORS.textDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  courierNameHeaderTitle: { fontSize: 16, fontWeight: '800', color: MAP_COLORS.textDark, letterSpacing: -0.2 },
  vehiclePlateSubtitleText: { fontSize: 12, fontWeight: '600', color: MAP_COLORS.textMuted, marginTop: 2 },
  destinationTextCopy: { fontSize: 12, fontWeight: '500', color: MAP_COLORS.textMuted, marginTop: 4 },
  profileCircleIconWrapper: { width: 44, height: 44, borderRadius: 22, backgroundColor: MAP_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: MAP_COLORS.borderLine },
  
  // 100% Round Call-To-Action Layout Controls
  communicationActionButtonPill: { flexDirection: 'row', width: '48%', height: 48, borderRadius: 24, backgroundColor: MAP_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: MAP_COLORS.borderLine },
  actionBtnLabelText: { fontSize: 13, fontWeight: '700', color: MAP_COLORS.textDark }
});
