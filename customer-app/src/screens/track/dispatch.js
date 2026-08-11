/**
 * Buza Food Delivery Mobile Application
 * Core Delivery Dispatch & Courier Tracking Lifecycle View
 * File: src/screens/dispatch.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const DISPATCH_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2'
};

const DISPATCH_STAGES = [
  { id: 0, label: 'Order Confirmed', description: 'The kitchen has accepted your request.' },
  { id: 1, label: 'Preparing Meal', description: 'Your order is currently being prepared.' },
  { id: 2, label: 'Driver Dispatched', description: 'A nearby courier is navigating to collect your package.' },
  { id: 3, label: 'Out for Delivery', description: 'The driver is in transit to your physical address.' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Delivery Dispatch & Courier Tracking Lifecycle View
 * File: src/screens/dispatch.js (Part 2 of 3)
 */

export default function DispatchScreen({
  orderId = "BUZA-89024",
  estimatedTime = "25 min",
  onCancelRequest,
  onContactSupport
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();
  const [currentStage, setCurrentStage] = useState(0);

  // --- Animation Vector References ---
  const fadeViewAnim = useRef(new Animated.Value(0)).current;
  const pulseRadarScale = useRef(new Animated.Value(1)).current;
  const backgroundDriftOneY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;
  const backgroundDriftTwoY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(fadeViewAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    // Loop simulating active transit tracking via radar scaling waves
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRadarScale, { toValue: 1.25, duration: 1500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulseRadarScale, { toValue: 1, duration: 1500, easing: Easing.in(Easing.quad), useNativeDriver: true })
      ])
    ).start();

    // Constant video-style running vector tracking loops
    const executeDriftLoop = (anim, duration, delay) => {
      Animated.loop(Animated.sequence([
        Animated.delay(delay),
        Animated.timing(anim, { toValue: -80, duration, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(anim, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])).start();
    };

    executeDriftLoop(backgroundDriftOneY, 8500, 0);
    executeDriftLoop(backgroundDriftTwoY, 11000, 3000);

    // Automated sequence driving mock tracking updates across logistics endpoints
    const lifecycleInterval = setInterval(() => {
      setCurrentStage((prev) => (prev < DISPATCH_STAGES.length - 1 ? prev + 1 : prev));
    }, 5000);

    return () => clearInterval(lifecycleInterval);
  }, []);
/**
 * Buza Food Delivery Mobile Application
 * Core Delivery Dispatch & Courier Tracking Lifecycle View
 * File: src/screens/dispatch.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Canvas */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        
        <Animated.View style={[styles.floatingVectorWrapper, { left: '14%', transform: [{ translateY: backgroundDriftOneY }] }]}>
          <CustomIcon name="delivery-scooter" size={26} color={DISPATCH_COLORS.primary + '20'} />
        </Animated.View>
        <Animated.View style={[styles.floatingVectorWrapper, { right: '16%', transform: [{ translateY: backgroundDriftTwoY }] }]}>
          <CustomIcon name="clock" size={24} color={DISPATCH_COLORS.textMuted + '18'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: fadeViewAnim }]}>
        
        {/* Top Minimalist Identification Header */}
        <View style={styles.rowSpaceBetween}>
          <View>
            <Text style={styles.trackingHeaderTitle}>Dispatch Logistics</Text>
            <Text style={styles.orderSubtitleText}>ID: {orderId}</Text>
          </View>
          <View style={styles.etaBadgeFrame}>
            <Text style={styles.etaBadgeValueText}>{estimatedTime}</Text>
          </View>
        </View>

        {/* Center Live Dispatch Radar Visualizer */}
        <View style={styles.centerRadarWorkspace}>
          <Animated.View style={[styles.radarOuterPulseRing, { transform: [{ scale: pulseRadarScale }] }]} />
          <View style={styles.radarCentralSphere}>
            <ActivityIndicator color={DISPATCH_COLORS.primary} size="large" />
          </View>
        </View>

        {/* Structured Milestone Progress Checklist */}
        <View style={styles.milestoneBlockWrapper}>
          {DISPATCH_STAGES.map((stage) => {
            const isCompleted = currentStage >= stage.id;
            const isActive = currentStage === stage.id;
            return (
              <View key={stage.id} style={styles.milestoneRowNode}>
                <View style={styles.milestoneIndicatorColumn}>
                  <View style={[styles.statusMarkerCircle, isCompleted && { backgroundColor: DISPATCH_COLORS.primary, borderColor: DISPATCH_COLORS.primary }]}>
                    {isCompleted && <CustomIcon name="check" size={12} color="#FFFFFF" />}
                  </View>
                  stage.id !== DISPATCH_STAGES.length - 1 && <View style={[styles.statusVerticalLine, isCompleted && { backgroundColor: DISPATCH_COLORS.primary }] /} >
                </View>
                <View style={styles.milestoneContentTextColumn}>
                  <Text style={[styles.stageLabelText, isActive && { color: DISPATCH_COLORS.primary }]}>{stage.label}</Text>
                  <Text style={styles.stageDescriptionText}>{stage.description}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Control Lower Button Panel Zone */}
        <View style={styles.lowerActionBlock}>
          <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.85} onPress={onContactSupport}>
            <Text style={styles.primaryButtonText}>Contact Support Hotline</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryActionButton} activeOpacity={0.75} onPress={onCancelRequest}>
            <Text style={styles.secondaryButtonText}>Cancel Active Order</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: DISPATCH_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Formats
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Identification Typography Layout
  trackingHeaderTitle: { fontSize: 22, fontWeight: '900', color: DISPATCH_COLORS.textDark, letterSpacing: -0.2 },
  orderSubtitleText: { fontSize: 13, fontWeight: '600', color: DISPATCH_COLORS.textMuted, marginTop: 2 },
  etaBadgeFrame: { backgroundColor: DISPATCH_COLORS.surfaceLight, borderWidth: 1, borderColor: DISPATCH_COLORS.borderLine, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 22 },
  etaBadgeValueText: { fontSize: 14, fontWeight: '800', color: DISPATCH_COLORS.primary },

  // Central Radar Architecture
  centerRadarWorkspace: { width: '100%', height: 160, alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  radarOuterPulseRing: { position: 'absolute', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255, 127, 80, 0.08)', borderWidth: 1.5, borderColor: 'rgba(255, 127, 80, 0.15)' },
  radarCentralSphere: { width: 80, height: 80, borderRadius: 40, backgroundColor: DISPATCH_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: DISPATCH_COLORS.borderLine },

  // Tracking Milestones Mechanics Layout
  milestoneBlockWrapper: { width: '100%', paddingHorizontal: 4 },
  milestoneRowNode: { flexDirection: 'row', width: '100%', minHeight: 52 },
  milestoneIndicatorColumn: { alignItems: 'center', marginRight: 16, width: 24 },
  statusMarkerCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 2, borderColor: DISPATCH_COLORS.borderLine, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  statusVerticalLine: { width: 2, flex: 1, backgroundColor: DISPATCH_COLORS.borderLine, marginVertical: -2 },
  milestoneContentTextColumn: { flex: 1, paddingBottom: 16, justifyContent: 'center' },
  stageLabelText: { fontSize: 15, fontWeight: '800', color: DISPATCH_COLORS.textDark },
  stageDescriptionText: { fontSize: 12, fontWeight: '500', color: DISPATCH_COLORS.textMuted, marginTop: 2 },

  // 100% Round Action Buttons Layout
  lowerActionBlock: { width: '100%', gap: 10 },
  primaryActionButton: { width: '100%', height: 54, borderRadius: 27, backgroundColor: DISPATCH_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: DISPATCH_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryActionButton: { width: '100%', height: 52, borderRadius: 26, backgroundColor: DISPATCH_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: DISPATCH_COLORS.borderLine },
  secondaryButtonText: { color: '#FF3B30', fontSize: 14, fontWeight: '700' }
});
