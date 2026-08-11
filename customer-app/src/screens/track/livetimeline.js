/**
 * Buza Food Delivery Mobile Application
 * Core High-Fidelity Active Order Live Tracking Timeline View
 * File: src/screens/livetimeline.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const TIMELINE_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successLine: '#4CD964', inactiveGray: '#E2E8F0'
};

const TIMELINE_MILESTONES = [
  { id: 1, title: 'Payment Authorized', detail: 'Transaction successfully processed and logged securely.', icon: 'shield-check', timestamp: '12:05 PM' },
  { id: 2, title: 'Kitchen Allocation', detail: 'The vendor has accepted your product ticket and started cooking.', icon: 'fudcamp', timestamp: '12:08 PM' },
  { id: 3, title: 'Courier Collection', detail: 'Alex K. arrived at the kitchen and loaded your delivery items.', icon: 'delivery-scooter', timestamp: '12:22 PM' },
  { id: 4, title: 'Transit Routine', detail: 'Driver is traversing proximity paths toward your destination.', icon: 'map-pin', timestamp: 'In Progress' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core High-Fidelity Active Order Live Tracking Timeline View
 * File: src/screens/livetimeline.js (Part 2 of 3)
 */

export default function LiveTimelineScreen({
  orderReference = "BUZA-90145",
  deliveryEta = "14 min remaining",
  onReturnToDashboard,
  onInitiateSupportRoute
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();
  
  // Set current programmatic fulfillment tracking marker index
  const [activeStepIndex, setActiveStepIndex] = useState(3);

  // --- Animation Vector Channels ---
  const fadeViewportAnim = useRef(new Animated.Value(0)).current;
  const trackerPulseScale = useRef(new Animated.Value(1)).current;
  const layoutDriftOneY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(fadeViewportAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    // Pulse active node tracking circle continuously to signal active tracking state
    Animated.loop(
      Animated.sequence([
        Animated.timing(trackerPulseScale, { toValue: 1.25, duration: 1200, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(trackerPulseScale, { toValue: 1, duration: 1200, easing: Easing.in(Easing.ease), useNativeDriver: true })
      ])
    ).start();

    // Video-style continuous running vector loops tracking upward
    Animated.loop(
      Animated.sequence([
        Animated.timing(layoutDriftOneY, { toValue: -80, duration: 9000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(layoutDriftOneY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);
/**
 * Buza Food Delivery Mobile Application
 * Core High-Fidelity Active Order Live Tracking Timeline View
 * File: src/screens/livetimeline.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '80%', transform: [{ translateY: layoutDriftOneY }] }]}>
          <CustomIcon name="calendar" size={24} color={TIMELINE_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: fadeViewportAnim }]}>
        
        {/* Navigation Ribbon Bar */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundBackActionButton} onPress={onReturnToDashboard}>
            <CustomIcon name="arrow-left" size={18} color={TIMELINE_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.orderLabelHeading}>ORDER REFERENCE</Text>
            <Text style={styles.orderValueText}>{orderReference}</Text>
          </View>
        </View>

        {/* Live Estimated Arrival Visualizer Panel */}
        <View style={styles.etaDisplayPanel}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.clockIconCircle}><CustomIcon name="clock" size={16} color={TIMELINE_COLORS.primary} /></View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.etaHeaderTitle}>Estimated Delivery</Text>
              <Text style={styles.etaCountdownSubtitle}>{deliveryEta}</Text>
            </View>
          </View>
        </View>

        {/* Vertical Stepper Timeline Execution Core */}
        <ScrollView style={{ flex: 1, marginVertical: 16 }} showsVerticalScrollIndicator={false}>
          {TIMELINE_MILESTONES.map((milestone, idx) => {
            const currentItemNumber = milestone.id;
            const isFinished = currentStepIndex >= currentItemNumber;
            const isCurrentlyProcessing = currentStepIndex === currentItemNumber;
            
            return (
              <View key={milestone.id} style={styles.stepperRowFrame}>
                
                {/* Visual Node Left Axis Column */}
                <View style={styles.visualAxisIndicatorColumn}>
                  {isCurrentlyProcessing && (
                    <Animated.View style={[styles.pulsingRadarRing, { transform: [{ scale: trackerPulseScale }] }]} />
                  )}
                  <View style={[styles.nodeStatusCircle, isFinished ? styles.nodeCompleted : styles.nodePending]}>
                    <CustomIcon 
                      name={isFinished ? "check" : milestone.icon} 
                      size={12} 
                      color={isFinished ? '#FFFFFF' : TIMELINE_COLORS.textMuted} 
                    />
                  </View>
                  {idx !== TIMELINE_MILESTONES.length - 1 && (
                    <View style={[styles.connectingAxisLine, isFinished && { backgroundColor: TIMELINE_COLORS.successLine }]} />
                  )}
                </View>

                {/* Meta Description Right Context Column */}
                <View style={styles.metaDataTextColumn}>
                  <View style={styles.rowSpaceBetween}>
                    <Text style={[styles.milestoneTitleHeader, isCurrentlyProcessing && { color: TIMELINE_COLORS.primary }]}>{milestone.title}</Text>
                    <Text style={styles.milestoneTimeText}>{milestone.timestamp}</Text>
                  </View>
                  <Text style={styles.milestoneDetailCopy}>{milestone.detail}</Text>
                </View>

              </View>
            );
          })}
        </ScrollView>

        {/* Help Desk Support Redirect Lower Panel Trigger */}
        <TouchableOpacity style={styles.primaryActionButton} activeOpacity={0.85} onPress={onInitiateSupportRoute}>
          <Text style={styles.primaryButtonText}>Open Live Support Ticket</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: TIMELINE_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Backdrop Frame Framework
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Navigation Configuration Strip
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: TIMELINE_COLORS.borderLine },
  roundBackActionButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: TIMELINE_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: TIMELINE_COLORS.borderLine },
  orderLabelHeading: { fontSize: 9, fontWeight: '800', color: TIMELINE_COLORS.textMuted, letterSpacing: 0.5 },
  orderValueText: { fontSize: 14, fontWeight: '800', color: TIMELINE_COLORS.textDark, marginTop: 2 },

  // Estimated Arrival Overlay Area
  etaDisplayPanel: { width: '100%', backgroundColor: TIMELINE_COLORS.surfaceLight, borderRadius: 16, borderWidth: 1, borderColor: TIMELINE_COLORS.borderLine, padding: 16, marginTop: 16 },
  clockIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: TIMELINE_COLORS.borderLine },
  etaHeaderTitle: { fontSize: 12, fontWeight: '700', color: TIMELINE_COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  etaCountdownSubtitle: { fontSize: 18, fontWeight: '900', color: TIMELINE_COLORS.textDark, marginTop: 2, letterSpacing: -0.2 },

  // Stepper Visual Axis Component Items
  stepperRowFrame: { flexDirection: 'row', width: '100%', minHeight: 74 },
  visualAxisIndicatorColumn: { alignItems: 'center', marginRight: 16, width: 24, position: 'relative' },
  nodeStatusCircle: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, zIndex: 10, backgroundColor: '#FFFFFF' },
  nodeCompleted: { backgroundColor: TIMELINE_COLORS.successLine, borderColor: TIMELINE_COLORS.successLine },
  nodePending: { borderColor: TIMELINE_COLORS.borderLine },
  pulsingRadarRing: { position: 'absolute', width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255, 127, 80, 0.08)', borderWidth: 1, borderColor: 'rgba(255, 127, 80, 0.15)', top: -6 },
  connectingAxisLine: { width: 2, flex: 1, backgroundColor: TIMELINE_COLORS.borderLine, marginVertical: -2 },
  metaDataTextColumn: { flex: 1, paddingBottom: 20, justifyContent: 'flex-start', paddingTop: 2 },
  milestoneTitleHeader: { fontSize: 15, fontWeight: '800', color: TIMELINE_COLORS.textDark, letterSpacing: -0.1 },
  milestoneTimeText: { fontSize: 11, fontWeight: '700', color: TIMELINE_COLORS.textMuted },
  milestoneDetailCopy: { fontSize: 12, fontWeight: '500', color: TIMELINE_COLORS.textMuted, marginTop: 4, lineHeight: 18 },

  // 100% Round Call-To-Action Trigger Button
  primaryActionButton: { width: '100%', height: 54, borderRadius: 27, backgroundColor: TIMELINE_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: TIMELINE_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }
});
