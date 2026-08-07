/**
 * Buza Food Delivery Mobile Application
 * Post-Logout Biometric Authentication Provisioning View
 * src/screens/biometricsetup.js
 * 
 * Part 1: Core Layout Imports and Design System Style Constants
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  Easing,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width, height } = Dimensions.get('window');

const BIOMETRIC_COLORS = {
  primary: '#D62246',       // Main brand accent color
  charcoal: '#1E1E24',      // Deep text color
  background: '#FFFFFF',    // Primary screen container fill
  surface: '#F8FAFC',       // Card background shading
  border: '#E2E8F0',        // Boundary divider line color
  textMuted: '#64748B',     // Supporting description paragraph color
  accentBlue: '#2563EB'     // Secondary feature focus color
};
/**
 * Part 2: Main Component Architecture and Hardware Prompt Handlers
 */

export default function BiometricSetupScreen({ onConfigurationComplete, onBypassPrompt }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  // Layout micro-interaction transition drivers
  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(25)).current;
  const iconFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parallel view entry animation configurations
    Animated.parallel([
      Animated.timing(fadeElementAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideContentAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();

    // Loop for continuous ambient icon float motion
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconFloatAnim, {
          toValue: -8,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(iconFloatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [fadeElementAnim, slideContentAnim, iconFloatAnim]);

  const handleBiometricActivation = () => {
    setIsProcessing(true);
    
    // Connection Point: Ready to link with native library (expo-local-authentication / react-native-fingerprint-scanner)
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Secure Sign In Enabled",
        "Biometric security parameters successfully updated. Future sign-ins will require verification.",
        [
          { 
            text: "Continue", 
            onPress: () => {
              if (onConfigurationComplete) {
                onConfigurationComplete({ biometricEnabled: true });
              }
            } 
          }
        ]
      );
    }, 1500);
  };

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={BIOMETRIC_COLORS.background} />

      {/* Main Container Viewport Layout Workspace */}
      <Animated.View 
        style={[
          styles.contentWorkspace, 
          { 
            paddingTop: insets.top + 40, 
            paddingBottom: Math.max(insets.bottom, 20),
            opacity: fadeElementAnim,
            transform: [{ translateY: slideContentAnim }]
          }
        ]}
      >
        {/* Upper Segment: Descriptive Hardware Authorization Visuals */}
        <View style={styles.hardwarePromptWrapper}>
          <Animated.View style={[styles.hardwareIconContainer, { transform: [{ translateY: iconFloatAnim }] }]}>
            <View style={styles.hardwareIconFrostedCore}>
              <CustomIcon name="fingerprint-scan" size={44} color={colors?.primary || BIOMETRIC_COLORS.primary} />
            </View>
          </Animated.View>

          <Text style={styles.mainHeadingTitle}>Faster Secure Access</Text>
          <Text style={styles.subtextSupportParagraph}>
            Enable biometric configurations to sign back into your account securely without typing your credentials.
          </Text>
        </View>

        {/* Lower Segment: Privacy Informational Guidelines and Control Actions */}
        <View style={styles.footerActionContainer}>
          <View style={styles.privacyCardBackdrop}>
            <View style={styles.privacyIconRow}>
              <CustomIcon name="shield-lock" size={16} color={BIOMETRIC_COLORS.accentBlue} style={styles.privacyIconPadding} />
              <Text style={styles.privacyCardTitle}>Privacy Protection Guarantee</Text>
            </View>
            <Text style={styles.privacyCardBody}>
              Biometric credentials data profiles are stored exclusively on your local device platform secure hardware enclave layer. BUZA never accesses or mirrors your personal biological identity profiles.
            </Text>
          </View>

          {/* Primary Action Button: Enable Hardware Link */}
          <TouchableOpacity 
            style={[styles.primaryActionBtnFrame, { backgroundColor: colors?.primary || BIOMETRIC_COLORS.primary }, isProcessing && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleBiometricActivation}
            disabled={isProcessing}
            accessibilityRole="button"
            accessibilityLabel="Enable Biometric Sign In"
          >
            <Text style={styles.primaryActionBtnText}>
              {isProcessing ? "Configuring Access..." : "Enable Biometric Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Secondary Action Button: Bypass Profile Setup */}
          <TouchableOpacity 
            style={styles.secondaryActionBtnFrame}
            activeOpacity={0.7}
            onPress={onBypassPrompt}
            disabled={isProcessing}
            accessibilityRole="button"
            accessibilityLabel="Skip for Now"
          >
            <Text style={styles.secondaryActionBtnText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}
/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix
 */

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: BIOMETRIC_COLORS.background,
  },
  contentWorkspace: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 26,
  },

  // Upper Area Elements Configuration Layout
  hardwarePromptWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 20,
  },
  hardwareIconContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(214, 34, 70, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(214, 34, 70, 0.1)',
  },
  hardwareIconFrostedCore: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  mainHeadingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: BIOMETRIC_COLORS.charcoal,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtextSupportParagraph: {
    fontSize: 14,
    fontWeight: '400',
    color: BIOMETRIC_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },

  // Lower Area Elements Configuration Layout
  footerActionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  privacyCardBackdrop: {
    width: '100%',
    backgroundColor: BIOMETRIC_COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: BIOMETRIC_COLORS.border,
    marginBottom: 28,
  },
  privacyIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  privacyIconPadding: {
    marginRight: 6,
  },
  privacyCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: BIOMETRIC_COLORS.charcoal,
    letterSpacing: 0.1,
  },
  privacyCardBody: {
    fontSize: 12,
    fontWeight: '400',
    color: BIOMETRIC_COLORS.textMuted,
    lineHeight: 18,
  },
  primaryActionBtnFrame: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    marginBottom: 12,
    minHeight: 48,
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryActionBtnFrame: {
    width: '100%',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryActionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: BIOMETRIC_COLORS.textMuted,
    letterSpacing: 0.1,
  },
});
