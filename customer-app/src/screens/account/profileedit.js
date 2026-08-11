/**
 * Buza Food Delivery Mobile Application
 * Core Account Identity Credential Modification View
 * File: src/screens/profileedit.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, TextInput, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const EDIT_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964'
};
/**
 * Buza Food Delivery Mobile Application
 * Core Account Identity Credential Modification View
 * File: src/screens/profileedit.js (Part 2 of 3)
 */

export default function ProfileEditScreen({
  initialName = "Jane Doe",
  initialEmail = "jane.doe@buzapremium.com",
  onSaveChangesCallback,
  onAbortModificationPress
}) {
  const insets = useSafeAreaInsets();
  const { radius, spacing } = useTheme();

  // --- Core Intake Field States ---
  const [fullName, setFullName] = useState(initialName);
  const [emailAddress, setEmailAddress] = useState(initialEmail);
  const [isSaving, setIsSaving] = useState(false);

  // --- Animation Vector Channels ---
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

  const handleProfileUpdateSubmission = () => {
    if (fullName.trim().length === 0 || emailAddress.trim().length === 0) return;
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSaveChangesCallback?.({
        name: fullName.trim(),
        email: emailAddress.trim()
      });
    }, 1400);
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Account Identity Credential Modification View
 * File: src/screens/profileedit.js (Part 3 of 3)
 */

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="profile" size={24} color={EDIT_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onAbortModificationPress}>
            <CustomIcon name="arrow-left" size={18} color={EDIT_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.editLabelHeading}>EDIT CREDENTIALS</Text>
            <Text style={styles.editTitleText}>Update Profile</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* Main Informational Icon Badge Header */}
          <View style={styles.centralHeaderPromptWorkspace}>
            <View style={styles.editIconCircle}>
              <CustomIcon name="profile" size={28} color={EDIT_COLORS.primary} />
            </View>
            <Text style={styles.mainPromptTitle}>Modify Identity</Text>
            <Text style={styles.instructionContextCopy}>Edit your system signature files to refresh account authentication schemas across communications, checkout tags, and billing channels.</Text>
          </View>

          {/* Secure Intake Inputs Fields Matrix (100% Circular Pills) */}
          <View style={styles.inputContainerMatrix}>
            <View style={styles.pillInputFieldWrapper}>
              <CustomIcon name="user" size={16} color={EDIT_COLORS.textMuted} style={{ marginRight: 12 }} />
              <TextInput style={styles.textInputFieldNode} placeholder="Full Legal Name" placeholderTextColor={EDIT_COLORS.textMuted + '70'} value={fullName} onChangeText={setFullName} autoCapitalize="words" />
            </View>

            <View style={styles.pillInputFieldWrapper}>
              <CustomIcon name="mail" size={16} color={EDIT_COLORS.textMuted} style={{ marginRight: 12 }} />
              <TextInput style={styles.textInputFieldNode} placeholder="Email Address" placeholderTextColor={EDIT_COLORS.textMuted + '70'} value={emailAddress} onChangeText={setEmailAddress} keyboardType="email-address" autoCapitalize="none" />
            </View>
          </View>

          {/* Verification Enforced Compliance Footer Line */}
          <View style={styles.complianceRibbonRow}>
            <CustomIcon name="shield-check" size={12} color={EDIT_COLORS.successGreen} style={{ marginRight: 6 }} />
            <Text style={styles.complianceTextCopy}>Updating attributes resets server profile index pools instantly.</Text>
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Layout Save Trigger Key) */}
        <TouchableOpacity 
          style={[styles.primaryPaymentActionButtonPill, (isSaving || fullName.trim().length === 0 || emailAddress.trim().length === 0) && { opacity: 0.5 }]} 
          activeOpacity={0.85} 
          onPress={handleProfileUpdateSubmission}
          disabled={isSaving || fullName.trim().length === 0 || emailAddress.trim().length === 0}
        >
          <Text style={styles.primaryActionButtonText}>
            {isSaving ? "Synchronizing Storage Assets..." : "Save Identity Framework Changes"}
          </Text>
        </TouchableOpacity>

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: EDIT_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: EDIT_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: EDIT_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: EDIT_COLORS.borderLine },
  editLabelHeading: { fontSize: 9, fontWeight: '800', color: EDIT_COLORS.textMuted, letterSpacing: 0.5 },
  editTitleText: { fontSize: 14, fontWeight: '800', color: EDIT_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  scrollContentLayout: { paddingVertical: 10, alignItems: 'center', width: '100%' },
  centralHeaderPromptWorkspace: { width: '100%', alignItems: 'center', marginVertical: 12, paddingHorizontal: 4 },
  editIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: EDIT_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: EDIT_COLORS.borderLine, marginBottom: 14 },
  mainPromptTitle: { fontSize: 20, fontWeight: '900', color: EDIT_COLORS.textDark, letterSpacing: -0.2 },
  instructionContextCopy: { fontSize: 13, fontWeight: '500', color: EDIT_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // Intake Input Field Matrices (100% Circular Pills)
  inputContainerMatrix: { width: '100%', gap: 12, marginTop: 12 },
  pillInputFieldWrapper: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24, backgroundColor: EDIT_COLORS.surfaceLight, borderWidth: 1, borderColor: EDIT_COLORS.borderLine, paddingHorizontal: 16 },
  textInputFieldNode: { flex: 1, fontSize: 14, color: EDIT_COLORS.textDark, fontWeight: '600', padding: 0 },

  // Compliance Layout Line
  complianceRibbonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 24 },
  complianceTextCopy: { fontSize: 11, fontWeight: '700', color: EDIT_COLORS.textMuted },

  // 100% Circular Primary Save Action Pill Key
  primaryPaymentActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: EDIT_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: EDIT_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }
});
