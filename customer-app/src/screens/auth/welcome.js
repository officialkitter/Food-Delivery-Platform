/**
 * Buza Food Delivery Mobile Application
 * Post-Registration Welcome Success View (Proportional Image Edition)
 * src/screens/welcome.js
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  StatusBar,
  Image,
  Easing,
  ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width, height } = Dimensions.get('window');

// Calculates the exact proportional height needed for your 1080x1200px photo
const IMAGE_WIDTH = 1080;
const IMAGE_HEIGHT = 1200;
const VISUAL_FRAME_HEIGHT = width * (IMAGE_HEIGHT / IMAGE_WIDTH);

const WELCOME_COLORS = {
  primary: '#FF7F50',       
  background: '#FFFFFF',    
  textDark: '#052A30',      
  textMuted: '#1E6B7B',     
  surfaceLight: '#F4FAFA',  
  borderLine: '#D1E5E7',    
  successTurquoise: '#0B4F5B' 
};

export default function WelcomeSuccessScreen({ onExploreApp }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const themePrimary = colors?.primary || WELCOME_COLORS.primary;

  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(20)).current;
  const scaleSuccessRingAnim = useRef(new Animated.Value(0.4)).current;

  // Hot food rising steam animation loops
  const smokeOneOpacity = useRef(new Animated.Value(0)).current;
  const smokeOneScale = useRef(new Animated.Value(1)).current;

  // Wave ripple border animation hooks
  const wavePulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeElementAnim, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(slideContentAnim, { toValue: 0, duration: 600, easing: Easing.out(Easing.back(1)), useNativeDriver: true }),
      Animated.timing(scaleSuccessRingAnim, { toValue: 1, duration: 700, easing: Easing.out(Easing.elastic(1.2)), useNativeDriver: true })
    ]).start();

    // Infinite breathing loop for icon wave borders
    Animated.loop(
      Animated.timing(wavePulseAnim, {
        toValue: 1,
        duration: 2400,
        easing: Easing.out(Easing.sin),
        useNativeDriver: true,
      })
    ).start();

    const startSmokeAnimation = (opacityAnim, scaleAnim, duration) => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(opacityAnim, { toValue: 0.35, duration: duration * 0.4, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1.4, duration: duration, useNativeDriver: true }),
          ]),
          Animated.timing(opacityAnim, { toValue: 0, duration: duration * 0.6, useNativeDriver: true }),
          Animated.timing(scaleAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    };
    startSmokeAnimation(smokeOneOpacity, smokeOneScale, 4500);
  }, []);

  // Calculate distinct offsets for the expanding fluid waves
  const waveScaleOne = wavePulseAnim.interpolate({ inputRange: [0,1], outputRange: [1, 1.35] });
  const waveOpacityOne = wavePulseAnim.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0.6, 0.4, 0] });

  const waveScaleTwo = wavePulseAnim.interpolate({ inputRange:[0,1], outputRange: [1, 1.65] });
  const waveOpacityTwo = wavePulseAnim.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0.4, 0.2, 0] });

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Uses a ScrollView wrapper so the content never breaks on small devices */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        bounces={false} 
        showsVerticalScrollIndicator={false}
      >
        {/* TOP FRAME: Configured to perfectly match your 1080x1200px asset aspect ratio */}
        <View style={styles.topHalfImage}>
          <Image 
            source={require('../../assets/images/11.png')} 
            style={StyleSheet.absoluteFillObject}
            resizeMode="contain"
          />
          
          {/* Floating Verification Centerpiece with Wave Borders */}
          <Animated.View style={[styles.successOuterCircle, { transform: [{ scale: scaleSuccessRingAnim }] }]}>
            
            {/* Animated Wave Rings */}
            <Animated.View style={[styles.waveRingOne, { transform: [{ scale: waveScaleOne }], opacity: waveOpacityOne }]} />
            <Animated.View style={[styles.waveRingTwo, { transform: [{ scale: waveScaleTwo }], opacity: waveOpacityTwo }]} />
            
            {/* Core Solid Icon Layer Container */}
            <View style={styles.successInnerCore}>
              <CustomIcon name="checkmark" size={28} color={WELCOME_COLORS.successTurquoise} />
            </View>
          </Animated.View>
        </View>

        {/* BOTTOM FRAME: UI Info Cards, Typography, and Action Controls */}
        <View style={[styles.bottomHalfContent, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          
          {/* Soft Background FX Behind Content Area */}
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <View style={styles.bubbleDarkTurquoise} />
            <View style={styles.bubbleSalmon} />
            <Animated.View style={[styles.smokeEffectCloud, { opacity: smokeOneOpacity, transform: [{ scale: smokeOneScale }] }]} />
          </View>

          <Animated.View 
            style={[styles.animatedContentWrapper, { opacity: fadeElementAnim, transform: [{ translateY: slideContentAnim }] }]}
          >
            {/* Typography Layout */}
            <View style={styles.textWrapper}>
              <Text style={styles.mainHeadingTitle}>You're Verified!</Text>
              <Text style={styles.subtextSupportParagraph}>Order. Track. Enjoy.</Text>
            </View>

            {/* Customer Info Card Detail Layout Box */}
            <View style={styles.brandCardBackdrop}>
              <Text style={styles.brandCardTitle}>Your Favorite Meals Await</Text>
              <Text style={styles.brandCardBody}>
                Browse menus, order your favorite food and drinks, and track everything right to your doorstep in real time.
              </Text>
            </View>

            {/* Action Trigger Button */}
            <TouchableOpacity 
              style={[styles.primaryActionBtnFrame, { backgroundColor: themePrimary }]}
              activeOpacity={0.85}
              onPress={onExploreApp}
            >
              <Text style={styles.primaryActionBtnText}>Start Ordering</Text>
            </TouchableOpacity>
          </Animated.View>

        </View>
      </ScrollView>
    </View>
  );
}
/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix
 */
const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: WELCOME_COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: WELCOME_COLORS.background,
  },
  
  // Custom height logic ensures your 1080x1200px file never stretches or distorts
  topHalfImage: {
    width: width,
    height: VISUAL_FRAME_HEIGHT,
    backgroundColor: WELCOME_COLORS.background,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  bottomHalfContent: {
    flex: 1,
    backgroundColor: WELCOME_COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  animatedContentWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // Icon Core wrapper base coordinates
  successOuterCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -38, 
    zIndex: 10,
  },

  // Waving Pulse Ring Styles Matrix
  waveRingOne: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: 'rgba(11, 79, 91, 0.4)',
    backgroundColor: 'rgba(5, 42, 48, 0.05)',
  },
  waveRingTwo: {
    position: 'absolute',
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 127, 80, 0.3)',
    backgroundColor: 'transparent',
  },

  successInnerCore: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(5, 42, 48, 0.15)',
    shadowColor: WELCOME_COLORS.successTurquoise,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 12,
  },

  textWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  mainHeadingTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: WELCOME_COLORS.textDark,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtextSupportParagraph: {
    fontSize: 13,
    fontWeight: '600',
    color: WELCOME_COLORS.textMuted,
    textAlign: 'center',
  },

  brandCardBackdrop: {
    width: '100%',
    backgroundColor: WELCOME_COLORS.surfaceLight,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: WELCOME_COLORS.borderLine,
    marginBottom: 24,
  },
  brandCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: WELCOME_COLORS.textDark,
    marginBottom: 4,
  },
  brandCardBody: {
    fontSize: 12,
    fontWeight: '600',
    color: WELCOME_COLORS.textMuted,
    lineHeight: 17,
  },
  primaryActionBtnFrame: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minHeight: 48,
    marginBottom: 8,
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  bubbleDarkTurquoise: { position: 'absolute', top: 20, right: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(5, 42, 48, 0.04)' },
  bubbleSalmon: { position: 'absolute', bottom: -40, left: -20, width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255, 127, 80, 0.05)' },
  smokeEffectCloud: { position: 'absolute', bottom: 40, left: '20%', width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(30, 107, 123, 0.04)' },
});
