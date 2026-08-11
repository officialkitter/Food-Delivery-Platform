/**
 * Buza Food Delivery Mobile Application
 * Post-Logout Biometric Authentication Provisioning View
 * src/screens/biometricsetup.js
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
  primary: '#FF7F50',       // Salmon brand accent color
  background: '#FFFFFF',    // Crisp premium white canvas baseline
  textDark: '#052A30',      // High-density Dark Turquoise for headings
  textMuted: '#1E6B7B',     // Soft turquoise for supporting descriptions
  surfaceLight: '#F4FAFA',  // Very soft turquoise-tinted card background
  borderLine: '#D1E5E7'     // Clean divider border color
};

export default function BiometricSetupScreen({ onConfigurationComplete, onBypassPrompt }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || BIOMETRIC_COLORS.primary;
  const [isProcessing, setIsProcessing] = useState(false);

  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(25)).current;
  const iconFloatAnim = useRef(new Animated.Value(0)).current;

  // Hot food rising steam animation loops
  const smokeOneOpacity = useRef(new Animated.Value(0)).current;
  const smokeOneScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeElementAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideContentAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.quad), useNativeDriver: true })
    ]).start();

    // Loop for continuous ambient icon float motion
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconFloatAnim, { toValue: -8, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(iconFloatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    ).start();

    // Continuous rising steam cloud animation loop
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(smokeOneOpacity, { toValue: 0.35, duration: 1800, useNativeDriver: true }),
          Animated.timing(smokeOneScale, { toValue: 1.4, duration: 4500, useNativeDriver: true })
        ]),
        Animated.timing(smokeOneOpacity, { toValue: 0, duration: 2700, useNativeDriver: true }),
        Animated.timing(smokeOneScale, { toValue: 1, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);

  const handleBiometricActivation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        "Instant Sign In Ready",
        "Your fingerprint setup is done! Now you can sign in quickly to order your food.",
        [{ text: "Great!", onPress: () => onConfigurationComplete?.({ biometricEnabled: true }) }]
      );
    }, 1500);
  };

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Decorative Atmosphere Elements and Floating Steam Matrix */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.bubbleDarkTurquoise} />
        <View style={styles.bubbleSalmon} />
        <Animated.View style={[styles.smokeEffectCloud, { opacity: smokeOneOpacity, transform: [{ scale: smokeOneScale }] }]} />
      </View>

      <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 40, paddingBottom: Math.max(insets.bottom, 20), opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]}>
        <View style={styles.hardwarePromptWrapper}>
          <Animated.View style={[styles.hardwareIconContainer, { transform: [{ translateY: iconFloatAnim }] }]}>
            <View style={styles.hardwareIconFrostedCore}>
              <CustomIcon name="fingerprint" size={44} color={themePrimary} />
            </View>
          </Animated.View>
          <Text style={styles.mainHeadingTitle}>Fast & Secure Ordering</Text>
          <Text style={styles.subtextSupportParagraph}>Turn on fingerprint sign-in to open your account instantly without typing your password.</Text>
        </View>

        <View style={styles.footerActionContainer}>
          <View style={styles.privacyCardBackdrop}>
            <Text style={styles.privacyCardTitle}>Make Simple & Secure login</Text>
            <Text style={styles.privacyCardBody}>Use Fingerprints and Face recognition for fast login.</Text>
          </View>

          <TouchableOpacity style={[styles.primaryActionBtnFrame, { backgroundColor: themePrimary }, isProcessing && { opacity: 0.6 }]} activeOpacity={0.85} onPress={handleBiometricActivation} disabled={isProcessing}>
            <Text style={styles.primaryActionBtnText}>{isProcessing ? "Setting it up..." : "Set up your biometrics"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionBtnFrame} activeOpacity={0.7} onPress={onBypassPrompt} disabled={isProcessing}>
            <Text style={styles.secondaryActionBtnText}>Skip for Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: BIOMETRIC_COLORS.background },
  contentWorkspace: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 26 },
  hardwarePromptWrapper: { alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 20 },
  hardwareIconContainer: { width: 104, height: 104, borderRadius: 52, backgroundColor: 'rgba(5, 42, 48, 0.06)', alignItems: 'center', justifyContent: 'center', marginBottom: 32, borderWidth: 1, borderColor: 'rgba(5, 42, 48, 0.1)' },
  hardwareIconFrostedCore: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#052A30', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  mainHeadingTitle: { fontSize: 24, fontWeight: '900', color: BIOMETRIC_COLORS.textDark, textAlign: 'center', letterSpacing: -0.5, marginBottom: 12 },
  subtextSupportParagraph: { fontSize: 14, fontWeight: '600', color: BIOMETRIC_COLORS.textMuted, textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },
  footerActionContainer: { width: '100%', alignItems: 'center' },
  privacyCardBackdrop: { width: '100%', backgroundColor: BIOMETRIC_COLORS.surfaceLight, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: BIOMETRIC_COLORS.borderLine, marginBottom: 28 },
  privacyCardTitle: { fontSize: 15, fontWeight: '800', color: BIOMETRIC_COLORS.textDark, marginBottom: 6 },
  privacyCardBody: { fontSize: 13, fontWeight: '600', color: BIOMETRIC_COLORS.textMuted, lineHeight: 19 },
  primaryActionBtnFrame: { width: '100%', height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 4, marginBottom: 14 },
  primaryActionBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  secondaryActionBtnFrame: { paddingVertical: 12 },
  secondaryActionBtnText: { fontSize: 14, fontWeight: '700', color: BIOMETRIC_COLORS.textMuted, textDecorationLine: 'underline' },
  bubbleDarkTurquoise: { position: 'absolute', top: -30, right: -40, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -50, left: -30, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', bottom: height * 0.35, left: '20%', width: 130, height: 130, borderRadius: 65, backgroundColor: 'rgba(30, 107, 123, 0.04)' }
});
