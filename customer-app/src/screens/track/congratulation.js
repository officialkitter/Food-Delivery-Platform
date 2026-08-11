/**
 * Buza Food Delivery Mobile Application
 * Multi-Purpose Order Placement & Delivery Fulfillment Congratulation Hub
 * File: src/screens/Congratulations.js (Part 1 of 2)
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

const CONGRATS_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2'
};

export default function CongratulationsScreen({
  mode = 'order_placed', // Layout Modes: 'order_placed' or 'delivery_completed'
  orderId = "BUZA-89024",
  courierName = "Alex K.",
  onPrimaryPress,        // Route to Tracking or Route to Rate Order
  onSecondaryPress       // Route back to Home Marketplace
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // Dynamic layout configuration mappings based on process status
  const isOrderMode = mode === 'order_placed';
  const displayTitle = isOrderMode ? "Order Placed Successfully!" : "Order Delivered!";
  const displaySubtitle = isOrderMode 
    ? `Your checkout sequence is verified. Order ID: ${orderId}. Preparing kitchen assets now.`
    : `Fulfillment verified. Courier ${courierName} successfully completed your destination drop-off.`;
  const primaryButtonText = isOrderMode ? "Track Realtime Delivery" : "Rate Product & Courier";

  // --- Animation References ---
  const scaleCenterpieceAnim = useRef(new Animated.Value(0.8)).current;
  const opacityCenterpieceAnim = useRef(new Animated.Value(0)).current;
  const opacityContentAnim = useRef(new Animated.Value(0)).current;
  const translateContentYAnim = useRef(new Animated.Value(20)).current;

  // Background running vector drift loops
  const vectorDriftOneY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;
  const vectorDriftTwoY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    // Entrance animations driving the central 3D asset expand
    Animated.parallel([
      Animated.timing(scaleCenterpieceAnim, { toValue: 1, duration: 800, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      Animated.timing(opacityCenterpieceAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(opacityContentAnim, { toValue: 1, duration: 600, delay: 300, useNativeDriver: true }),
      Animated.timing(translateContentYAnim, { toValue: 0, duration: 600, delay: 300, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();

    // Constant video-style running vector loops tracking upward
    const triggerVectorLoop = (anim, duration, delay) => {
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: -80, duration, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(anim, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])).start();
    };

    triggerVectorLoop(vectorDriftOneY, 8000, 0);
    triggerVectorLoop(vectorDriftTwoY, 10000, 2500);
  }, [mode]);
/**
 * Buza Food Delivery Mobile Application
 * Multi-Purpose Order Placement & Delivery Fulfillment Congratulation Hub
 * File: src/screens/Congratulations.js (Part 2 of 2)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Canvas Layout */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: vectorDriftOneY }] }]}>
          <CustomIcon name={isOrderMode ? "cart" : "check-circle"} size={26} color={CONGRATS_COLORS.primary + '20'} />
        </Animated.View>
        <Animated.View style={[styles.floatingVectorWrapper, { right: '15%', transform: [{ translateY: vectorDriftTwoY }] }]}>
          <CustomIcon name="delivery-scooter" size={28} color={CONGRATS_COLORS.textMuted + '18'} />
        </Animated.View>
      </View>

      {/* Centerpiece Content Layout Display Canvas */}
      <View style={[styles.viewportWorkspace, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          
          {/* Animated Central 3D Vector Icon Block Layout */}
          <Animated.View style={[styles.centerpieceAssetContainer, { opacity: opacityCenterpieceAnim, transform: [{ scale: scaleCenterpieceAnim }] }]}>
            <View style={styles.iconSpunCircle}>
              <CustomIcon name="checkmark" size={48} />
            </View>
          </Animated.View>

          {/* Typography Copy Sections */}
          <Animated.View style={[styles.textMetadataBlock, { opacity: opacityContentAnim, transform: [{ translateY: translateContentYAnim }] }]}>
            <Text style={styles.mainHeadingTitle}>{displayTitle}</Text>
            <Text style={styles.supportingSubtitleText}>{displaySubtitle}</Text>
          </Animated.View>

        </View>

        {/* Action Panel Lower Block Layout Zone */}
        <Animated.View style={[styles.lowerActionBlock, { opacity: opacityContentAnim }]}>
          
          {/* Primary Multi-Purpose 100% Round Call-To-Action Button */}
          <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.85} onPress={onPrimaryPress}>
            <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
          </TouchableOpacity>

          {/* Secondary Hub Backroute Redirect Action Button */}
          <TouchableOpacity style={styles.secondaryActionButton} activeOpacity={0.75} onPress={onSecondaryPress}>
            <Text style={styles.secondaryButtonText}>Return to Home Marketplace</Text>
          </TouchableOpacity>

        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: CONGRATS_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', alignItems: 'center' },
  
  // Ambient Background Architecture Framework Layout Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -30, right: -40, width: 240, height: 240, borderRadius: 120, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -50, left: -40, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Center Content Assets Layout Rules
  centerpieceAssetContainer: { width: 120, height: 120, alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  iconSpunCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: CONGRATS_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CONGRATS_COLORS.borderLine, shadowColor: CONGRATS_COLORS.textDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  textMetadataBlock: { width: '100%', alignItems: 'center', paddingHorizontal: 8 },
  mainHeadingTitle: { fontSize: 24, fontWeight: '900', color: CONGRATS_COLORS.textDark, textAlign: 'center', letterSpacing: -0.3, marginBottom: 12 },
  supportingSubtitleText: { fontSize: 14, fontWeight: '500', color: CONGRATS_COLORS.textMuted, textAlign: 'center', lineHeight: 22 },

  // Interactive Lower Controls Layout Rules
  lowerActionBlock: { width: '100%', gap: 12, marginTop: 20 },
  primaryActionButton: { width: '100%', height: 54, borderRadius: 27, backgroundColor: CONGRATS_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: CONGRATS_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', letterSpacing: -0.1 },
  secondaryActionButton: { width: '100%', height: 52, borderRadius: 26, backgroundColor: CONGRATS_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CONGRATS_COLORS.borderLine },
  secondaryButtonText: { color: CONGRATS_COLORS.textDark, fontSize: 14, fontWeight: '700' }
});
