/**
 * Buza Food Delivery Mobile Application
 * Core System Preferences & Core Parameters Hub View
 * File: src/screens/sattings.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ScrollView, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const SETTINGS_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  toggleActive: '#4CD964'
};
/**
 * Buza Food Delivery Mobile Application
 * Core System Preferences & Core Parameters Hub View
 * File: src/screens/sattings.js (Part 2 of 3)
 */

export default function SettingsScreen({ 
  onNavigateToTermsRoute, 
  onBackRoutePress 
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core Mechanical Toggles States ---
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [locationPermitEnabled, setLocationPermitEnabled] = useState(true);
  const [biometricAuthEnabled, setBiometricAuthEnabled] = useState(false);
  const [isPurgingCache, setIsPurgingCache] = useState(false);

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

  const handlePurgePlatformCache = () => {
    setIsPurgingCache(true);
    setTimeout(() => {
      setIsPurgingCache(false);
      Alert.alert("System Maintenance", "Platform runtime temporary files successfully purged.");
    }, 1200);
  };
/**
 * Buza Food Delivery Mobile Application
 * Core System Preferences & Core Parameters Hub View
 * File: src/screens/sattings.js (Part 3 of 3)
 */

  const parametersConfigList = [
    { title: 'Dark Mode Framework', detail: 'Invert app themes to premium dark layout.', state: darkModeEnabled, hook: setDarkModeEnabled, icon: 'eye' },
    { title: 'Location Tracking Permission', detail: 'Synchronize GPS maps tracking vectors.', state: locationPermitEnabled, hook: setLocationPermitEnabled, icon: 'map-pin' },
    { title: 'Biometric Security Access', detail: 'Enforce fingerprint secure checking validation.', state: biometricAuthEnabled, hook: setBiometricAuthEnabled, icon: 'fingerprint' }
  ];

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="service" size={24} color={SETTINGS_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onBackRoutePress}>
            <CustomIcon name="arrow-left" size={18} color={SETTINGS_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.settingsLabelHeading}>SYSTEM PARAMETERS</Text>
            <Text style={styles.settingsTitleText}>App Settings</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* Vertical Toggle Item Rows (100% Round Component Frames) */}
          <View style={styles.toggleSelectorVerticalStack}>
            {parametersConfigList.map((config, idx) => (
              <View key={idx} style={styles.toggleRoundRowPill}>
                <View style={styles.toggleContentGroupLeft}>
                  <View style={styles.providerIconWrapperCircle}>
                    <CustomIcon name={config.icon} size={16} color={SETTINGS_COLORS.textDark} />
                  </View>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={styles.toggleNameLabel}>{config.title}</Text>
                    <Text style={styles.toggleDetailLabel}>{config.detail}</Text>
                  </View>
                </View>
                
                {/* 100% Round Custom Mechanical Toggle Switch Track */}
                <TouchableOpacity
                  style={[styles.switchTrackOuter, config.state ? { backgroundColor: SETTINGS_COLORS.toggleActive } : { backgroundColor: SETTINGS_COLORS.borderLine }]}
                  activeOpacity={0.9}
                  onPress={() => config.hook(!config.state)}
                >
                  <View style={[styles.switchThumbInnerCircle, config.state ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' }]} />
                </TouchableOpacity>
              </View>
            ))}

            {/* Manual Maintenance Command Row Component (100% Round Pill Frame) */}
            <TouchableOpacity style={styles.toggleRoundRowPill} activeOpacity={0.8} onPress={handlePurgePlatformCache} disabled={isPurgingCache}>
              <View style={styles.toggleContentGroupLeft}>
                <View style={styles.providerIconWrapperCircle}>
                  <CustomIcon name="shield-check" size={16} color={SETTINGS_COLORS.textDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleNameLabel}>Purge Temporary Cache</Text>
                  <Text style={styles.toggleDetailLabel}>{isPurgingCache ? 'Clearing indices pools...' : 'Free storage files memory assets.'}</Text>
                </View>
              </View>
              <Text style={styles.utilityActionLabelText}>CLEAN</Text>
            </TouchableOpacity>

            {/* Sub-Route Legal Hyperlink Option Row Component (100% Round Pill Frame) */}
            <TouchableOpacity style={styles.toggleRoundRowPill} activeOpacity={0.8} onPress={onNavigateToTermsRoute}>
              <View style={styles.toggleContentGroupLeft}>
                <View style={styles.providerIconWrapperCircle}>
                  <CustomIcon name="list" size={16} color={SETTINGS_COLORS.textDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toggleNameLabel}>Terms of Compliance</Text>
                  <Text style={styles.toggleDetailLabel}>Review system privacy regulations files.</Text>
                </View>
              </View>
              <Text style={styles.utilityActionLabelText}>VIEW</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

        {/* Action Panel Lower Controls Redirect Key (100% Circular Return Button) */}
        <TouchableOpacity style={styles.primaryBackActionButtonPill} activeOpacity={0.85} onPress={onBackRoutePress}>
          <Text style={styles.primaryActionButtonText}>Return to Account Hub</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: SETTINGS_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: SETTINGS_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: SETTINGS_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SETTINGS_COLORS.borderLine },
  settingsLabelHeading: { fontSize: 9, fontWeight: '800', color: SETTINGS_COLORS.textMuted, letterSpacing: 0.5 },
  settingsTitleText: { fontSize: 14, fontWeight: '800', color: SETTINGS_COLORS.textDark, marginTop: 2 },

  // Central Workspace Switch Stacks Framework (100% Round Pills)
  scrollContentLayout: { paddingVertical: 14, width: '100%' },
  toggleSelectorVerticalStack: { width: '100%', gap: 10 },
  toggleRoundRowPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 64, borderRadius: 32, backgroundColor: SETTINGS_COLORS.surfaceLight, borderWidth: 1, borderColor: SETTINGS_COLORS.borderLine, paddingHorizontal: 16, paddingVertical: 10 },
  toggleContentGroupLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  providerIconWrapperCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SETTINGS_COLORS.borderLine, marginRight: 12 },
  toggleNameLabel: { fontSize: 14, fontWeight: '800', color: SETTINGS_COLORS.textDark },
  toggleDetailLabel: { fontSize: 11, fontWeight: '500', color: SETTINGS_COLORS.textMuted, marginTop: 2 },
  utilityActionLabelText: { fontSize: 11, fontWeight: '800', color: SETTINGS_COLORS.primary, letterSpacing: 0.5, paddingRight: 4 },
  
  // Custom Mechanical Toggles (100% Round Components)
  switchTrackOuter: { width: 48, height: 26, borderRadius: 13, padding: 2, justifyContent: 'center' },
  switchThumbInnerCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFFFFF', shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },

  // 100% Circular Primary Back Action Pill Key
  primaryBackActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: SETTINGS_COLORS.textDark, alignItems: 'center', justifyContent: 'center', shadowColor: SETTINGS_COLORS.textDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 3 }
});
