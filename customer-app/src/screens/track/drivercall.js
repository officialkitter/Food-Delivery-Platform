/**
 * Buza Food Delivery Mobile Application
 * Secured In-App VoIP Driver Call Center Interface View
 * File: src/screens/drivercall.js (Part 1 of 3)
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

const CALL_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  dangerRed: '#FF3B30', successGreen: '#4CD964'
};
/**
 * Buza Food Delivery Mobile Application
 * Secured In-App VoIP Driver Call Center Interface View
 * File: src/screens/drivercall.js (Part 2 of 3)
 */

export default function DriverCallScreen({
  courierName = "Alex K.",
  vehiclePlate = "TX-894-BZ",
  onDisconnectCall
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core State Controllers ---
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // --- Animation Refs ---
  const pulseRhythmAnim = useRef(new Animated.Value(1)).current;
  const layoutFadeAnim = useRef(new Animated.Value(0)).current;
  const floatingDriftOneY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;

  useEffect(() => {
    // Entrance layout sequence
    Animated.timing(layoutFadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();

    // Infinite calling rhythm ripple sound wave animation loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseRhythmAnim, { toValue: 1.14, duration: 1400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulseRhythmAnim, { toValue: 1, duration: 1400, easing: Easing.in(Easing.quad), useNativeDriver: true })
      ])
    ).start();

    // Constant video-style running vector tracking loops
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingDriftOneY, { toValue: -80, duration: 9000, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(floatingDriftOneY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();

    // Call ticker duration calculator incrementing every single second
    const countTicker = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(countTicker);
  }, []);

  // Format digital stopwatch display time variables string (MM:SS format)
  const formatStopwatchDisplay = (secondsCount) => {
    const computedMinutes = Math.floor(secondsCount / 60);
    const computedSeconds = secondsCount % 60;
    return `${computedMinutes < 10 ? '0' : ''}${computedMinutes}:${computedSeconds < 10 ? '0' : ''}${computedSeconds}`;
  };
/**
 * Buza Food Delivery Mobile Application
 * Secured In-App VoIP Driver Call Center Interface View
 * File: src/screens/drivercall.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '20%', transform: [{ translateY: floatingDriftOneY }] }]}>
          <CustomIcon name="profile" size={24} color={CALL_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40, opacity: layoutFadeAnim }]}>
        
        {/* Top Segment: Safe Enforced Label Banner */}
        <View style={styles.topSecureHeader}>
          <CustomIcon name="shield-check" size={14} color={CALL_COLORS.successGreen} style={{ marginRight: 6 }} />
          <Text style={styles.securedCallTextLabel}>End-To-End Encrypted Voice Connection</Text>
        </View>

        {/* Center Segment: Courier Profile Avatar Avatar & Audio Wave Rings */}
        <View style={styles.centerProfileWorkspace}>
          <Animated.View style={[styles.outerAudioWavePulsar, { transform: [{ scale: pulseRhythmAnim }] }]} />
          <View style={styles.profileCircleBoundary}>
            <CustomIcon name="profile" size={44} color={CALL_COLORS.textDark} />
          </View>
          
          <Text style={styles.courierNameHeader}>{courierName}</Text>
          <Text style={styles.vehiclePlateSubtitleText}>Active Courier • {vehiclePlate}</Text>
          <Text style={styles.stopwatchTimerCounterText}>{formatStopwatchDisplay(callDuration)}</Text>
        </View>

        {/* Lower Segment: Audio Manipulation & Disconnect Controls Matrix */}
        <View style={styles.lowerControlDashboardPanel}>
          
          <View style={[styles.rowSpaceBetween, { paddingHorizontal: 24, marginBottom: 32 }]}>
            {/* Audio Mute Action Toggle Switch */}
            <TouchableOpacity 
              style={[styles.audioModifierButtonCircle, isMuted && { backgroundColor: CALL_COLORS.textDark }]} 
              activeOpacity={0.8} 
              onPress={() => setIsMuted(!isMuted)}
            >
              <CustomIcon name="eye-off" size={20} color={isMuted ? '#FFFFFF' : CALL_COLORS.textDark} />
            </TouchableOpacity>

            {/* Audio Speakerphone Action Toggle Switch */}
            <TouchableOpacity 
              style={[styles.audioModifierButtonCircle, isSpeakerOn && { backgroundColor: CALL_COLORS.textDark }]} 
              activeOpacity={0.8} 
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              <CustomIcon name="service" size={20} color={isSpeakerOn ? '#FFFFFF' : CALL_COLORS.textDark} />
            </TouchableOpacity>
          </View>

          {/* Core Disconnect Hang-up Action Control Button (100% Round Circle) */}
          <TouchableOpacity style={styles.disconnectCallButtonCircle} activeOpacity={0.85} onPress={onDisconnectCall}>
            <CustomIcon name="arrow-left" size={24} color="#FFFFFF" style={{ transform: [{ rotate: '-45deg' }] }} />
          </TouchableOpacity>

        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: CALL_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', alignItems: 'center' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Backdrop Frame Framework
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Encrypted Header Call Display Banner
  topSecureHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: CALL_COLORS.surfaceLight, borderWidth: 1, borderColor: CALL_COLORS.borderLine, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100 },
  securedCallTextLabel: { fontSize: 11, fontWeight: '700', color: CALL_COLORS.textMuted, letterSpacing: 0.1 },

  // Profile Information Area Architecture
  centerProfileWorkspace: { width: '100%', alignItems: 'center', marginTop: DEVICE_HEIGHT * 0.04 },
  outerAudioWavePulsar: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255, 127, 80, 0.06)', borderWidth: 1.5, borderColor: 'rgba(255, 127, 80, 0.12)', top: -10 },
  profileCircleBoundary: { width: 120, height: 120, borderRadius: 60, backgroundColor: CALL_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: CALL_COLORS.borderLine, marginBottom: 24, shadowColor: CALL_COLORS.textDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  courierNameHeader: { fontSize: 24, fontWeight: '900', color: CALL_COLORS.textDark, letterSpacing: -0.3, marginBottom: 6 },
  vehiclePlateSubtitleText: { fontSize: 13, fontWeight: '600', color: CALL_COLORS.textMuted, marginBottom: 16 },
  stopwatchTimerCounterText: { fontSize: 20, fontWeight: '800', color: CALL_COLORS.primary, letterSpacing: 1 },

  // 100% Round Calling Action Panel Dashboard
  lowerControlDashboardPanel: { width: '100%', alignItems: 'center' },
  audioModifierButtonCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: CALL_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CALL_COLORS.borderLine },
  disconnectCallButtonCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: CALL_COLORS.dangerRed, alignItems: 'center', justifyContent: 'center', shadowColor: CALL_COLORS.dangerRed, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }
});
