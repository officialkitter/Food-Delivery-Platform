/**
 * Buza Food Delivery Mobile Application
 * Core Direct Order Tracking Overview Dashboard
 * File: src/screens/ordertracking.js (Part 1 of 3)
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const TRACK_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  statusGreen: '#4CD964'
};
/**
 * Buza Food Delivery Mobile Application
 * Core Direct Order Tracking Overview Dashboard
 * File: src/screens/ordertracking.js (Part 2 of 3)
 */

export default function OrderTrackingScreen({
  orderNumber = "BUZA-90145",
  restaurantName = "Buza Grill House",
  deliveryStatusString = "Courier is approaching your block",
  timeRemainingString = "12 min away",
  onViewMapPress,
  onViewTimelinePress,
  onBackRoutePress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Animation Vector Channels ---
  const layoutFadeAnim = useRef(new Animated.Value(0)).current;
  const loopPulseScale = useRef(new Animated.Value(1)).current;
  const backgroundDriftY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(layoutFadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();

    // Constant pulsing wave to highlight active delivery progress
    Animated.loop(
      Animated.sequence([
        Animated.timing(loopPulseScale, { toValue: 1.08, duration: 1500, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(loopPulseScale, { toValue: 1, duration: 1500, easing: Easing.in(Easing.ease), useNativeDriver: true })
      ])
    ).start();

    // Constant video-style running vector drift loops tracking vertically
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundDriftY, { toValue: -80, duration: 9000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(backgroundDriftY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);
/**
 * Buza Food Delivery Mobile Application
 * Core Direct Order Tracking Overview Dashboard
 * File: src/screens/ordertracking.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '20%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="delivery-scooter" size={24} color={TRACK_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Top Strip Navigation Header */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onBackRoutePress}>
            <CustomIcon name="arrow-left" size={18} color={TRACK_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.trackingLabelHeading}>ORDER STATUS</Text>
            <Text style={styles.orderNumberText}>{orderNumber}</Text>
          </View>
        </View>

        {/* Centralized High-Fidelity Active Tracking Radar Hub */}
        <View style={styles.centralPulseContainer}>
          <Animated.View style={[styles.radarOuterPulseRing, { transform: [{ scale: loopPulseScale }] }]} />
          <View style={styles.radarCentralSphere}>
            <CustomIcon name="delivery-scooter" size={36} color={TRACK_COLORS.primary} />
          </View>
          <Text style={styles.countdownTimerHeadline}>{timeRemainingString}</Text>
          <Text style={styles.restaurantMetaText}>Preparing package from {restaurantName}</Text>
        </View>

        {/* Informative Status Details Content Field */}
        <View style={styles.statusDescriptionBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <View style={styles.greenSignalDot} />
            <Text style={styles.liveIndicatorLabel}>LIVE UPDATE</Text>
          </View>
          <Text style={styles.liveStatusDetailCopy}>{deliveryStatusString}</Text>
        </View>

        {/* Action Panel Lower Controls Selection (100% Round Action Buttons) */}
        <View style={styles.lowerActionPanelGroup}>
          
          <TouchableOpacity style={styles.primaryActionButtonPill} activeOpacity={0.85} onPress={onViewMapPress}>
            <CustomIcon name="map-pin" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryActionButtonText}>View Live Route Map</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButtonPill} activeOpacity={0.75} onPress={onViewTimelinePress}>
            <CustomIcon name="list" size={16} color={TRACK_COLORS.textDark} style={{ marginRight: 8 }} />
            <Text style={styles.secondaryActionButtonText}>View Detailed Milestone Timeline</Text>
          </TouchableOpacity>

        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: TRACK_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: TRACK_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: TRACK_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: TRACK_COLORS.borderLine },
  trackingLabelHeading: { fontSize: 9, fontWeight: '800', color: TRACK_COLORS.textMuted, letterSpacing: 0.5 },
  orderNumberText: { fontSize: 14, fontWeight: '800', color: TRACK_COLORS.textDark, marginTop: 2 },

  // Central Radar Components Layout Rules
  centralPulseContainer: { width: '100%', alignItems: 'center', marginVertical: 14 },
  radarOuterPulseRing: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255, 127, 80, 0.06)', borderWidth: 1.5, borderColor: 'rgba(255, 127, 80, 0.12)', top: -14 },
  radarCentralSphere: { width: 110, height: 110, borderRadius: 55, backgroundColor: TRACK_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: TRACK_COLORS.borderLine, shadowColor: TRACK_COLORS.textDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  countdownTimerHeadline: { fontSize: 26, fontWeight: '900', color: TRACK_COLORS.textDark, marginTop: 24, letterSpacing: -0.4 },
  restaurantMetaText: { fontSize: 13, fontWeight: '600', color: TRACK_COLORS.textMuted, marginTop: 6, textAlign: 'center' },

  // Live Updates Information Component Frame Layout Rules
  statusDescriptionBox: { width: '100%', backgroundColor: TRACK_COLORS.surfaceLight, borderRadius: 16, borderWidth: 1, borderColor: TRACK_COLORS.borderLine, padding: 16 },
  greenSignalDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: TRACK_COLORS.statusGreen, marginRight: 6 },
  liveIndicatorLabel: { fontSize: 10, fontWeight: '800', color: TRACK_COLORS.statusGreen, letterSpacing: 0.5 },
  liveStatusDetailCopy: { fontSize: 14, fontWeight: '700', color: TRACK_COLORS.textDark, marginTop: 4, lineHeight: 20 },

  // Lower Action Dashboard Panels (100% Round Circle Pill Formats)
  lowerActionPanelGroup: { width: '100%', gap: 10, marginTop: 10 },
  primaryActionButtonPill: { flexDirection: 'row', width: '100%', height: 54, borderRadius: 27, backgroundColor: TRACK_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: TRACK_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryActionButtonPill: { flexDirection: 'row', width: '100%', height: 52, borderRadius: 26, backgroundColor: TRACK_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: TRACK_COLORS.borderLine },
  secondaryActionButtonText: { color: TRACK_COLORS.textDark, fontSize: 14, fontWeight: '700' }
});
