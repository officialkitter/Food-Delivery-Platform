/**
 * Buza Food Delivery Mobile Application
 * Core Account Identity Profile Information Summary View
 * File: src/screens/profile.js (Part 1 of 3)
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const PROFILE_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964'
};
/**
 * Buza Food Delivery Mobile Application
 * Core Account Identity Profile Information Summary View
 * File: src/screens/profile.js (Part 2 of 3)
 */

export default function ProfileScreen({
  userData = {
    fullName: "Jane Doe",
    emailAddress: "jane.doe@buzapremium.com",
    phoneNumber: "+255 700 000 000",
    accountTier: "Premium VIP Client",
    joinDate: "Joined October 2025"
  },
  onModifyIdentityPress, // Routes safely onto profileedit.js
  onBackRoutePress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

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

  // Structural user meta properties mapped cleanly for high density loops
  const IDENTITY_SUMMARY_ROWS = [
    { label: 'Full Legal Name', value: userData.fullName, vectorIcon: 'profile' },
    { label: 'Registered Email Address', value: userData.emailAddress, vectorIcon: 'mail' },
    { label: 'Verified Phone Number', value: userData.phoneNumber, vectorIcon: 'service' },
    { label: 'Marketplace Account Tier', value: userData.accountTier, vectorIcon: 'shield-check' }
  ];
/**
 * Buza Food Delivery Mobile Application
 * Core Account Identity Profile Information Summary View
 * File: src/screens/profile.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="profile" size={24} color={PROFILE_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onBackRoutePress}>
            <CustomIcon name="arrow-left" size={18} color={PROFILE_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.profileLabelHeading}>USER IDENTITY</Text>
            <Text style={styles.profileTitleText}>My Profile</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* Top Big Profile Avatar Identity Circle */}
          <View style={styles.centralAvatarWorkspace}>
            <View style={styles.avatarBigCircle}>
              <CustomIcon name="profile" size={44} color={PROFILE_COLORS.textDark} />
            </View>
            <Text style={styles.avatarNameHeader}>{userData.fullName}</Text>
            <Text style={styles.avatarJoinDateSubtitle}>{userData.joinDate}</Text>
          </View>

          {/* Read Only Data Rows Matrix Blocks (100% Round Parameter Wrappers) */}
          <View style={styles.profileSummaryVerticalStack}>
            {IDENTITY_SUMMARY_ROWS.map((row, idx) => (
              <View key={idx} style={styles.profileDataRoundRowPill}>
                <View style={styles.providerIconWrapperCircle}>
                  <CustomIcon name={row.vectorIcon} size={16} color={PROFILE_COLORS.textDark} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dataFieldLabelSmall}>{row.label}</Text>
                  <Text style={styles.dataFieldValueText} numberOfLines={1}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Edit Trigger Redirect Key) */}
        
          <CustomIcon name="service" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.primaryActionButtonText}>Modify Profile Credentials</Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: PROFILE_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: PROFILE_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: PROFILE_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: PROFILE_COLORS.borderLine },
  profileLabelHeading: { fontSize: 9, fontWeight: '800', color: PROFILE_COLORS.textMuted, letterSpacing: 0.5 },
  profileTitleText: { fontSize: 14, fontWeight: '800', color: PROFILE_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  scrollContentLayout: { paddingVertical: 10, alignItems: 'center', width: '100%' },
  centralAvatarWorkspace: { width: '100%', alignItems: 'center', marginVertical: 16, paddingHorizontal: 4 },
  avatarBigCircle: { width: 88, height: 88, borderRadius: 44, backgroundColor: PROFILE_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: PROFILE_COLORS.borderLine, marginBottom: 14, shadowColor: PROFILE_COLORS.textDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  avatarNameHeader: { fontSize: 20, fontWeight: '900', color: PROFILE_COLORS.textDark, letterSpacing: -0.2 },
  avatarJoinDateSubtitle: { fontSize: 12, fontWeight: '600', color: PROFILE_COLORS.textMuted, marginTop: 4 },

  // Vertical Parameter Information Cards (100% Spherical Borders)
  profileSummaryVerticalStack: { width: '100%', gap: 10, marginTop: 12 },
  profileDataRoundRowPill: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 60, borderRadius: 30, backgroundColor: PROFILE_COLORS.surfaceLight, borderWidth: 1, borderColor: PROFILE_COLORS.borderLine, paddingHorizontal: 16 },
  providerIconWrapperCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: PROFILE_COLORS.borderLine, marginRight: 12 },
  dataFieldLabelSmall: { fontSize: 10, fontWeight: '700', color: PROFILE_COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.3 },
  dataFieldValueText: { fontSize: 14, fontWeight: '700', color: PROFILE_COLORS.textDark, marginTop: 1 },

  // 100% Circular Primary Edit Action Pill Key
  primaryEditActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: PROFILE_COLORS.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', shadowColor: PROFILE_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }
});
