/**
 * Buza Food Delivery Mobile Application
 * Secure Session Termination & Authorization Deletion Gateway
 * File: src/screens/logout.js (Part 1 of 3)
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

const LOGOUT_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  dangerRed: '#FF3B30'
};
/**
 * Buza Food Delivery Mobile Application
 * Secure Session Termination & Authorization Deletion Gateway
 * File: src/screens/logout.js (Part 2 of 3)
 */

export default function LogoutScreen({
  onConfirmLogoutCallback,
  onAbortLogoutPress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core State Controllers ---
  const [isClearingSession, setIsClearingSession] = useState(false);

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

  const handleSessionTermination = () => {
    setIsClearingSession(true);
    // Simulates clearing cryptographic security tokens and async storage matrices
    setTimeout(() => {
      setIsClearingSession(false);
      onConfirmLogoutCallback?.();
    }, 1500);
  };
/**
 * Buza Food Delivery Mobile Application
 * Secure Session Termination & Authorization Deletion Gateway
 * File: src/screens/logout.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="lock" size={24} color={LOGOUT_COLORS.dangerRed + '12'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onAbortLogoutPress}>
            <CustomIcon name="arrow-left" size={18} color={LOGOUT_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.sessionLabelHeading}>SECURITY IDENTITY</Text>
            <Text style={styles.sessionTitleText}>Close Session</Text>
          </View>
        </View>

        {/* Central Prompts Workspace Area Frame */}
        <View style={styles.centralIconFrameWorkspace}>
          <View style={styles.lockIconCircle}>
            <CustomIcon name="lock" size={32} color={LOGOUT_COLORS.dangerRed} />
          </View>
          <Text style={styles.mainVerificationPrompt}>Terminate Active Session</Text>
          <Text style={styles.instructionContextCopy}>Are you certain you want to log out? Cryptographic tokens will be cleared, and you will need to re-verify credentials to authorize future orders.</Text>
        </View>

        {/* Action Panel Lower Controls (100% Round Circle Pill Formats) */}
        <View style={styles.lowerActionPanelGroup}>
          <TouchableOpacity 
            style={[styles.primaryLogoutActionButtonPill, isClearingSession && { opacity: 0.6 }]} 
            activeOpacity={0.85} 
            onPress={handleSessionTermination}
            disabled={isClearingSession}
          >
            {isClearingSession ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryActionButtonText}>Confirm Session Logout</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButtonPill} activeOpacity={0.75} onPress={onAbortLogoutPress}>
            <Text style={styles.secondaryActionButtonText}>Cancel and Maintain Session</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: LOGOUT_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', alignItems: 'center' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: LOGOUT_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: LOGOUT_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: LOGOUT_COLORS.borderLine },
  sessionLabelHeading: { fontSize: 9, fontWeight: '800', color: LOGOUT_COLORS.textMuted, letterSpacing: 0.5 },
  sessionTitleText: { fontSize: 14, fontWeight: '800', color: LOGOUT_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  centralIconFrameWorkspace: { width: '100%', alignItems: 'center', marginVertical: 32, paddingHorizontal: 8 },
  lockIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: LOGOUT_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: LOGOUT_COLORS.borderLine, marginBottom: 16 },
  mainVerificationPrompt: { fontSize: 20, fontWeight: '900', color: LOGOUT_COLORS.textDark, letterSpacing: -0.2 },
  instructionContextCopy: { fontSize: 13, fontWeight: '500', color: LOGOUT_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // Lower Action Panel Layout Clusters (100% Round Circle Pill Formats)
  lowerActionPanelGroup: { width: '100%', gap: 10 },
  primaryLogoutActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: LOGOUT_COLORS.dangerRed, alignItems: 'center', justifyContent: 'center', shadowColor: LOGOUT_COLORS.dangerRed, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryActionButtonPill: { width: '100%', height: 52, borderRadius: 26, backgroundColor: LOGOUT_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: LOGOUT_COLORS.borderLine },
  secondaryActionButtonText: { color: LOGOUT_COLORS.textDark, fontSize: 14, fontWeight: '700' }
});
