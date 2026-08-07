/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Pre-Launch Dynamic High-Fidelity Splash Landing View
 * src/features/auth/ComingSoon.js
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useForm } from '../../shared/hooks/useForm';
import { Validators } from '../../shared/utils/validators';

const { width: DEVICE_WIDTH } = Dimensions.get('window');

export const ComingSoon = () => {
  const { colors, spacing, radius } = useTheme();
  const [successState, setSuccessState] = useState(false);

  // Micro-interaction tactile button scaling vector
  const actionScaleAnim = useRef(new Animated.Value(1)).current;

  // Form Processing Integration Layer Hook
  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { emailAddress: '' },
    {
      emailAddress: (value) =>
        !Validators.validateEmail(value) ? 'Please register a valid email profile.' : null,
    }
  );

  const handleNotifyMeSubmission = async (formData) => {
    // Simulate standard cloud network database payload sync operations
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setSuccessState(true);
    console.log('[Buza Marketing Hub]: Pre-launch subscriber logged ->', formData.emailAddress);
  };

  const onPressInFeedback = () => {
    Animated.timing(actionScaleAnim, { toValue: 0.95, duration: 90, useNativeDriver: true }).start();
  };

  const onPressOutFeedback = () => {
    Animated.spring(actionScaleAnim, { toValue: 1, friction: 4, tension: 160, useNativeDriver: true }).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.fullscreenCanvas, { backgroundColor: '#011627' }]} // Deep blue luxury dark mode palette code
    >
      {/* 1. Ambient Lighting System Mesh (Soft Neon Glow Vectors) */}
      <View style={[styles.glowSpotOrange, { backgroundColor: '#FF6B57' }]} />
      <View style={[styles.glowSpotMint, { backgroundColor: '#4CD964' }]} />

      <ScrollView contentContainerStyle={styles.scrollLayout} bounces={false}>
        
        {/* 2. Upper-Center Glowing Brand Circle Anchor */}
        <View style={styles.upperCenterHeroBlock}>
          <View style={[styles.glowingOuterRing, { borderColor: 'rgba(255, 107, 87, 0.4)' }]}>
            <View style={[styles.glowingInnerRing, { borderColor: 'rgba(76, 217, 100, 0.6)', backgroundColor: '#021e35' }]}>
              <Text style={styles.brandSymbolLogoText}>B</Text>
            </View>
          </View>
          
          <View style={[styles.badgeContainer, { backgroundColor: 'rgba(255, 255, 255, 0.07)', borderRadius: radius.full }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>🚀 COMING SOON</Text>
          </View>
        </View>

        {/* 3. Bold High-Contrast Value Statement Text Blocks */}
        <View style={[styles.middleTypographyBlock, { paddingHorizontal: spacing.lg }]}>
          <Text style={styles.headlineTitle}>
            Your Favorite Meals.{'\n'}Delivered <Text style={{ color: '#4CD964' }}>Fast.</Text>
          </Text>
          <Text style={[styles.bodyDescription, { color: '#A1A1A1', marginTop: spacing.md }]}>
            The premium culinary concierge application crafted to redefine marketplace convenience. Join the private access queue below.
          </Text>
        </View>

        {/* 4. Onboarding Subscription Matrix Panel (Thumb-Reach Ergonomic Action Zone) */}
        <View style={[styles.lowerInteractiveFormBlock, { paddingHorizontal: spacing.md, marginBottom: spacing.xl }]}>
          {successState ? (
            <Animated.View style={styles.successAnimationWrapper}>
              <Text style={styles.successIconCheck}>🎉</Text>
              <Text style={[styles.successHeadline, { color: '#FFFFFF' }]}>You are on the VIP registry!</Text>
              <Text style={styles.successSubtitle}>We will notify you the exact moment kitchens go live.</Text>
            </Animated.View>
          ) : (
            <View style={styles.formContainer}>
              <View
                style={[
                  styles.pillInputWrapper,
                  {
                    backgroundColor: '#021e35',
                    borderColor: errors.emailAddress ? '#FF3B30' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: radius.full,
                  },
                ]}
              >
                <Text style={styles.inputLeftIconMail}>✉️</Text>
                <TextInput
                  placeholder="Enter your premium email address..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={values.emailAddress}
                  onChangeText={(text) => handleChange('emailAddress', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isSubmitting}
                  style={styles.textInputNode}
                />
              </View>

              {errors.emailAddress && (
                <Text style={styles.formErrorFeedbackText}>{errors.emailAddress}</Text>
              )}

              <Animated.View style={{ transform: [{ scale: actionScaleAnim }], marginTop: spacing.md }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPressIn={onPressInFeedback}
                  onPressOut={onPressOutFeedback}
                  onPress={handleSubmit(handleNotifyMeSubmission)}
                  disabled={isSubmitting || values.emailAddress.trim().length === 0}
                  style={[
                    styles.primaryPillActionButton,
                    {
                      backgroundColor: '#4CD964', // Energetic Fresh Green call-to-action color token
                      borderRadius: radius.full,
                      height: 54,
                    },
                    isSubmitting && { opacity: 0.6 },
                  ]}
                >
                  <Text style={styles.pillActionBtnLabelText}>
                    {isSubmitting ? 'Registering Queue...' : 'Notify Me'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  fullscreenCanvas: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  scrollLayout: {
    flexGrow: 1,
    justifyContent: 'space-between',
    zIndex: 5,
  },
  glowSpotOrange: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.15,
    mixBlendMode: 'screen',
  },
  glowSpotMint: {
    position: 'absolute',
    bottom: -60,
    left: -100,
    width: 360,
    height: 360,
    borderRadius: 180,
    opacity: 0.12,
  },
  upperCenterHeroBlock: {
    alignItems: 'center',
    marginTop: 64,
    width: '100%',
  },
  glowingOuterRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B57',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  glowingInnerRing: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CD964',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  brandSymbolLogoText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  badgeContainer: {
    marginTop: 24,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  middleTypographyBlock: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 32,
  },
  headlineTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 38,
  },
  bodyDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: DEVICE_WIDTH * 0.85,
  },
  lowerInteractiveFormBlock: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  formContainer: {
    width: '100%',
  },
  pillInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderWidth: 1.5,
    paddingHorizontal: 16,
  },
  inputLeftIconMail: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.7,
  },
  textInputNode: {
    flex: 1,
    height: '100%',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  formErrorFeedbackText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 18,
    marginTop: 6,
  },
  primaryPillActionButton: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CD964',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  pillActionBtnLabelText: {
    color: '#011627',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  successAnimationWrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  successIconCheck: {
    fontSize: 40,
    marginBottom: 12,
  },
  successHeadline: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  successSubtitle: {
    fontSize: 13,
    color: '#A1A1A1',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
});
