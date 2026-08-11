/**
 * Buza Food Delivery Mobile Application
 * Cinematic Brand Splash Initializer View
 * src/screens/splash.js
 * 
 * Part 1: Core Layout Imports and Design System Style Constants
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  ActivityIndicator,
  Easing
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width, height } = Dimensions.get('window');

// Inverted to premium White layout with balanced Salmon and Dark Turquoise palettes
const SPLASH_COLORS = {
  primary: '#FF7F50',       // Salmon brand highlight color
  background: '#FFFFFF',    // Crisp white primary screen canvas
  textDark: '#052A30',      // Deep high-contrast Dark Turquoise for main typography
  textMuted: '#1E6B7B',     // Mid-tone Turquoise for supporting paragraph descriptions
};

/**
 * Part 2: Main Component Architecture, Brand Entry Scales, and Transition Timers
 */
export default function SplashScreen({ onInitializationComplete }) {
  const { colors } = useTheme();
  const themePrimary = colors?.primary || SPLASH_COLORS.primary;

  // Primary branding element animation vectors (Kept original logic)
  const logoScaleAnim = useRef(new Animated.Value(0.85)).current;
  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const textTranslateYAnim = useRef(new Animated.Value(15)).current;

  // Floating ambient bubble animation vectors (Kept original logic)
  const bubbleOneY = useRef(new Animated.Value(height)).current;
  const bubbleTwoY = useRef(new Animated.Value(height)).current;
  const bubbleThreeY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    // 1. Parallel entry vectors driving the cinematic centerpiece expansion
    Animated.parallel([
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacityAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();

    // 2. Delayed text container slide reveal transitions
    Animated.timing(textOpacityAnim, {
      toValue: 1,
      duration: 800,
      delay: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(textTranslateYAnim, {
      toValue: 0,
      duration: 800,
      delay: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // 3. Independent continuous loops creating a beautiful ambient rising bubble wallpaper
    const startBubbleLoop = (anim, duration, delayValue) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delayValue),
          Animated.timing(anim, {
            toValue: -100,
            duration: duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startBubbleLoop(bubbleOneY, 4500, 0);
    startBubbleLoop(bubbleTwoY, 6000, 1500);
    startBubbleLoop(bubbleThreeY, 5200, 800);

    // 4. Initialization completes handing execution layers over safely
    const operationalTimer = setTimeout(() => {
      if (onInitializationComplete) {
        onInitializationComplete();
      }
    }, 3200);

    return () => clearTimeout(operationalTimer);
  }, [logoScaleAnim, logoOpacityAnim, textOpacityAnim, textTranslateYAnim, bubbleOneY, bubbleTwoY, bubbleThreeY, onInitializationComplete]);

  return (
    <View style={styles.masterContainer}>
      {/* Light status bar icons for high visibility on absolute white canvas */}
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Cinematic Ambient Canvas Backdrop Frame Layer */}
      <View style={StyleSheet.absoluteFill}>
        {/* Explicitly updated background bubble configurations */}
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />
        <View style={styles.grid} />

        {/* Floating Bubble Architecture Overlay */}
        <Animated.View style={[styles.bubbleAsset, styles.bubbleOne, { transform: [{ translateY: bubbleOneY }] }]} />
        <Animated.View style={[styles.bubbleAsset, styles.bubbleTwo, { transform: [{ translateY: bubbleTwoY }] }]} />
        <Animated.View style={[styles.bubbleAsset, styles.bubbleThree, { transform: [{ translateY: bubbleThreeY }] }]} />
      </View>

      {/* Main Core Viewport Elements Layout Canvas Frame - Perfectly Centered */}
      <View style={styles.brandingCenterpieceWorkspace}>
        
        {/* Animated Brand Identity Centerpiece */}
        <Animated.View 
          style={[
            styles.logoContainer, 
            { opacity: logoOpacityAnim, transform: [{ scale: logoScaleAnim }] }
          ]}
        >
          <CustomIcon
            name="buza-branding"
            size={96}
            color={themePrimary}
            useBrandAsset
          />
        </Animated.View>

        {/* Text Container: Title and Tagline Typography Selection */}
        <Animated.View 
          style={[
            styles.typographyContainer, 
            { opacity: textOpacityAnim, transform: [{ translateY: textTranslateYAnim }] }
          ]}
        >
          <Text style={styles.mainTitleHeader}>FREE DELIVERY PLATFORM</Text>
          <Text style={styles.supportingTaglineText}>Meet the best local vendors and enjoy their best specials for free</Text>
        </Animated.View>

        {/* Integrated Loading Indicator inside the center cluster */}
        <View style={styles.loadingIndicatorContainer}>
          <ActivityIndicator color={themePrimary} size="small" />
        </View>

      </View>
    </View>
  );
}

/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix
 */
const styles = StyleSheet.create({
  // Root Layout Canvas Configurations
  masterContainer: {
    flex: 1,
    backgroundColor: SPLASH_COLORS.background,
  },
  // Background gradient mesh textures (Calibrated Dark Turquoise and Salmon backgrounds)
  orbOne: { position: 'absolute', top: -40, right: -50, width: 280, height: 280, borderRadius: 140, backgroundColor: 'rgba(5, 42, 48, 0.05)' },
  orbTwo: { position: 'absolute', bottom: -60, left: -40, width: 320, height: 320, borderRadius: 160, backgroundColor: 'rgba(255, 127, 80, 0.07)' },
  grid: { ...StyleSheet.absoluteFillObject, borderWidth: 1, borderColor: 'rgba(5, 42, 48, 0.01)' },
  
  // Custom clear ambient rising bubble elements configuration
  bubbleAsset: {
    position: 'absolute',
    backgroundColor: 'rgba(5, 42, 48, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(5, 42, 48, 0.06)',
  },
  bubbleOne: {
    left: width * 0.15,
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
  },
  bubbleTwo: {
    left: width * 0.75,
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
    borderColor: 'rgba(255, 127, 80, 0.15)', // Bottom-right bubble highlighted in subtle Salmon 
  },
  bubbleThree: {
    left: width * 0.45,
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
  },

  brandingCenterpieceWorkspace: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    paddingHorizontal: 32,
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },

  typographyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  mainTitleHeader: {
    fontSize: 24,
    fontWeight: '900',
    color: SPLASH_COLORS.textDark,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  supportingTaglineText: {
    fontSize: 13,
    fontWeight: '600',
    color: SPLASH_COLORS.textMuted,
    letterSpacing: 0.5,
    textAlign: 'center',
    lineHeight: 19,
  },

  loadingIndicatorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
});
