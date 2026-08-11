/**
 * Buza Food Delivery Mobile Application
 * Premium Pre-Launch Dynamic High-Fidelity Splash Landing View
 * src/features/auth/ComingSoon.js
 */

import React, { useState, useRef, useEffect } from 'react';
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
  Easing
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useForm } from '../../shared/hooks/useForm';
import { Validators } from '../../shared/utils/validators';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');
const COMING_COLORS = { primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30', textMuted: '#1E6B7B', surfaceLight: '#F4FAFA', borderLine: '#D1E5E7' };

export const ComingSoon = () => {
  const { radius, spacing } = useTheme();
  const [successState, setSuccessState] = useState(false);

  // Button press feedback animation drivers
  const actionScaleAnim = useRef(new Animated.Value(1)).current;

  // Top Logo Entry Animation Drivers (Splash Screen Matching Core)
  const logoScaleAnim = useRef(new Animated.Value(0.85)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;

  // Video-Like Continuous Asset Animation Loops
  const motorX = useRef(new Animated.Value(-100)).current;
  const packageY = useRef(new Animated.Value(0)).current;
  const emojiOneY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;
  const emojiTwoY = useRef(new Animated.Value(DEVICE_HEIGHT + 100)).current;

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm(
    { emailAddress: '' },
    { emailAddress: (val) => !Validators.validateEmail(val) ? 'Please enter a valid email address.' : null }
  );

  useEffect(() => {
    // 1. Splash Screen exact entry logic for top logo
    Animated.parallel([
      Animated.timing(logoScaleAnim, { toValue: 1, duration: 1200, easing: Easing.out(Easing.back(1.5)), useNativeDriver: true }),
      Animated.timing(logoOpacityAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
    ]).start();

    // 2. Continuous horizontal racing motor timeline
    Animated.loop(
      Animated.timing(motorX, { toValue: DEVICE_WIDTH + 80, duration: 4000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    // 3. Continuous vertical bobbing food package loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(packageY, { toValue: -15, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(packageY, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true })
      ])
    ).start();

    // 4. Video-like continuous streaming floating emojis
    const startFloatingEmoji = (anim, duration, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: -60, duration: duration, easing: Easing.linear, useNativeDriver: true })
        ])
      ).start();
    };
    startFloatingEmoji(emojiOneY, 5000, 0);
    startFloatingEmoji(emojiTwoY, 6500, 1800);
  }, []);

  const onPressInFeedback = () => {
    Animated.timing(actionScaleAnim, {
      toValue: 0.96,
      duration: 90,
      useNativeDriver: true,
    }).start();
  };

  const onPressOutFeedback = () => {
    Animated.spring(actionScaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 160,
      useNativeDriver: true,
    }).start();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.fullscreenCanvas}>
      {/* MAGNIFICENT VIDEO-LIKE BACKGROUND EFFECTS LAYER */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />
        
        {/* Continuous Horizontal Riding Delivery Motor */}
        <Animated.View style={[styles.movingMotor, { transform: [{ translateX: motorX }] }]}>
          <CustomIcon name="delivery-scooter" size={38} color="rgba(255, 127, 80, 0.25)" />
        </Animated.View>

        {/* Continuous Floating Food Package */}
        <Animated.View style={[styles.floatingPackage, { transform: [{ translateY: packageY }] }]}>
          <CustomIcon name="cart" size={44} color="rgba(30, 107, 123, 0.12)" />
        </Animated.View>

        {/* Continuous Video Stream Floating Emojis */}
        <Animated.Text style={[styles.streamingEmoji, { left: '15%', transform: [{ translateY: emojiOneY }] }]}>🍔</Animated.Text>
        <Animated.Text style={[styles.streamingEmoji, { left: '80%', transform: [{ translateY: emojiTwoY }] }]}>🍹</Animated.Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollLayout} bounces={false} showsVerticalScrollIndicator={false}>
        {/* Upper Segment: Branding Logo Header Setup (Splash Screen Match) */}
        <View style={styles.upperCenterHeroBlock}>
          <Animated.View style={[styles.logoContainer, { opacity: logoOpacityAnim, transform: [{ scale: logoScaleAnim }] }]}>
            <CustomIcon name="buza-branding" size={96} color={COMING_COLORS.primary} useBrandAsset />
          </Animated.View>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>COMING SOON</Text>
          </View>
        </View>

        {/* Middle Segment: Simple Food Wording */}
        <View style={styles.middleTypographyBlock}>
          <Text style={styles.headlineTitle}>Your Favorite Meals.{'\n'}Delivered <Text style={{ color: COMING_COLORS.primary }}>Fast.</Text></Text>
          <Text style={styles.bodyDescription}>We are bringing the best local food and fresh drinks straight to your doorstep. Join our waiting list to know the exact second we open!</Text>
        </View>

        {/* Lower Segment: Registration Input Controls */}
        <View style={styles.lowerInteractiveFormBlock}>
          {successState ? (
            <View style={styles.successAnimationWrapper}>
              <Text style={styles.successIconCheck}>🎉</Text>
              <Text style={styles.successHeadline}>You're on the list!</Text>
              <Text style={styles.successSubtitle}>We will send you an email the exact second our kitchens go live.</Text>
            </View>
          ) : (
            <View style={styles.formContainer}>
              <View style={[styles.pillInputWrapper, { borderColor: errors.emailAddress ? '#DC2626' : COMING_COLORS.borderLine, borderRadius: radius.full }]}>
                <Text style={styles.inputLeftIconMail}>✉️</Text>
                <TextInput placeholder="Enter your email address..." placeholderTextColor="rgba(30, 107, 123, 0.4)" value={values.emailAddress} onChangeText={(text) => handleChange('emailAddress', text)} keyboardType="email-address" autoCapitalize="none" editable={!isSubmitting} style={styles.textInputNode} />
              </View>
              {errors.emailAddress && <Text style={styles.formErrorFeedbackText}>{errors.emailAddress}</Text>}
              <Animated.View style={{ transform: [{ scale: actionScaleAnim }], marginTop: spacing.md }}>
                <TouchableOpacity activeOpacity={1} onPressIn={onPressInFeedback} onPressOut={onPressOutFeedback} onPress={handleSubmit(() => setSuccessState(true))} disabled={isSubmitting || values.emailAddress.trim().length === 0} style={[styles.primaryPillActionButton, { borderRadius: radius.full }]}>
                  <Text style={styles.pillActionBtnLabelText}>{isSubmitting ? 'Saving your spot...' : 'Get Notified'}</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix
 */
const styles = StyleSheet.create({
  // Main Absolute Viewport Canvas Architecture
  fullscreenCanvas: { 
    flex: 1, 
    position: 'relative', 
    overflow: 'hidden', 
    backgroundColor: COMING_COLORS.background 
  },
  scrollLayout: { 
    flexGrow: 1, 
    justifyContent: 'space-between', 
    zIndex: 5, 
    paddingBottom: 24 
  },

  // Video-Like Magnificent Background Accents
  orbOne: { 
    position: 'absolute', 
    top: -40, 
    right: -50, 
    width: 280, 
    height: 280, 
    borderRadius: 140, 
    backgroundColor: 'rgba(5, 42, 48, 0.04)' 
  },
  orbTwo: { 
    position: 'absolute', 
    bottom: -60, 
    left: -40, 
    width: 320, 
    height: 320, 
    borderRadius: 160, 
    backgroundColor: 'rgba(255, 127, 80, 0.05)' 
  },
  movingMotor: { 
    position: 'absolute', 
    top: '42%' 
  },
  floatingPackage: { 
    position: 'absolute', 
    top: '15%', 
    left: '72%' 
  },
  streamingEmoji: { 
    position: 'absolute', 
    fontSize: 26, 
    opacity: 0.18 
  },

  // Upper Branding Architecture (Splash Core Match Setup)
  upperCenterHeroBlock: { 
    alignItems: 'center', 
    marginTop: 50, 
    width: '100%' 
  },
  logoContainer: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  badgeContainer: { 
    marginTop: 16, 
    paddingHorizontal: 14, 
    paddingVertical: 6, 
    backgroundColor: 'rgba(5, 42, 48, 0.04)', 
    borderRadius: 20 
  },
  badgeText: { 
    fontSize: 11, 
    fontWeight: '800', 
    letterSpacing: 1.5, 
    color: COMING_COLORS.textMuted 
  },

  // Middle Content Blocks (Simplified Wording Presentation)
  middleTypographyBlock: { 
    width: '100%', 
    alignItems: 'center', 
    paddingHorizontal: 24 
  },
  headlineTitle: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: COMING_COLORS.textDark, 
    textAlign: 'center', 
    lineHeight: 36 
  },
  bodyDescription: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: COMING_COLORS.textMuted, 
    textAlign: 'center', 
    lineHeight: 22, 
    marginTop: 12, 
    paddingHorizontal: 16 
  },

  // Lower Subscription Entry Control Panel
  lowerInteractiveFormBlock: { 
    width: '100%', 
    paddingHorizontal: 24, 
    marginBottom: 20 
  },
  formContainer: { 
    width: '100%' 
  },
  pillInputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: COMING_COLORS.surfaceLight, 
    borderWidth: 1.5, 
    height: 54, 
    paddingHorizontal: 16 
  },
  inputLeftIconMail: { 
    fontSize: 18, 
    marginRight: 10 
  },
  textInputNode: { 
    flex: 1, 
    height: '100%', 
    fontSize: 15, 
    color: COMING_COLORS.textDark, 
    fontWeight: '600' 
  },
  formErrorFeedbackText: { 
    color: '#DC2626', 
    fontSize: 12, 
    fontWeight: '700', 
    marginTop: 6, 
    marginLeft: 16 
  },
  primaryPillActionButton: { 
    width: '100%', 
    backgroundColor: COMING_COLORS.textDark, 
    height: 54, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 2, 
    shadowColor: '#000000', 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 4 
  },
  pillActionBtnLabelText: { 
    fontSize: 15, 
    fontWeight: '800', 
    color: '#FFFFFF' 
  },

  // VIP Success Feedback Message Box
  successAnimationWrapper: { 
    alignItems: 'center', 
    padding: 20 
  },
  successIconCheck: { 
    fontSize: 44, 
    marginBottom: 12 
  },
  successHeadline: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: COMING_COLORS.textDark, 
    marginBottom: 6 
  },
  successSubtitle: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: COMING_COLORS.textMuted, 
    textAlign: 'center', 
    lineHeight: 20 
  }
});
