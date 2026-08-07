/**
 * Buza Food Delivery Mobile Application
 * Post-Registration Welcome Success View
 * src/screens/welcome.js
 * 
 * Part 1: Architecture Imports and Local Style Constants
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
  Easing
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width, height } = Dimensions.get('window');

const WELCOME_COLORS = {
  primary: '#D62246',       // Main corporate brand color
  charcoal: '#1E1E24',      // Deep title text color
  background: '#FFFFFF',    // Canvas baseline background
  surface: '#F8FAFC',       // Card element shading
  border: '#E2E8F0',         // Divider line parameters
  textMuted: '#64748B',     // Subordinate paragraph text
  successGreen: '#22C55E'   // Verification accent tone
};
/**
 * Part 2: Main Component Structure and Entrance Animation Loops
 */

export default function WelcomeSuccessScreen({ onExploreApp }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Animation layout timing state controls
  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(30)).current;
  const scaleSuccessRingAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Run parallel entrance motion parameters for a high-quality feel
    Animated.parallel([
      Animated.timing(fadeElementAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideContentAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      Animated.timing(scaleSuccessRingAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.elastic(1.2)),
        useNativeDriver: true,
      })
    ]).start();
  }, [fadeElementAnim, slideContentAnim, scaleSuccessRingAnim]);

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={WELCOME_COLORS.background} />

      {/* Main Core Viewport Container Workspace */}
      <Animated.View 
        style={[
          styles.contentWorkspace, 
          { 
            paddingTop: insets.top + 60, 
            paddingBottom: Math.max(insets.bottom, 20),
            opacity: fadeElementAnim,
            transform: [{ translateY: slideContentAnim }]
          }
        ]}
      >
        {/* Upper Layout: Success Affirmation Graphics Area */}
        <View style={styles.successGraphicWrapper}>
          <Animated.View style={[styles.successOuterCircle, { transform: [{ scale: scaleSuccessRingAnim }] }]}>
            <View style={styles.successInnerCore}>
              <CustomIcon name="checkmark" size={36} color={WELCOME_COLORS.successGreen} />
            </View>
          </Animated.View>

          <Text style={styles.mainHeadingTitle}>Account Verified</Text>
          <Text style={styles.subtextSupportParagraph}>
            Welcome to the family. Your profile space configuration is fully complete.
          </Text>
        </View>

        {/* Lower Layout: Informational Brand Message and Navigation Action Button */}
        <View style={styles.footerActionContainer}>
          <View style={styles.brandCardBackdrop}>
            <Text style={styles.brandCardTitle}>The Table Is Set</Text>
            <Text style={styles.brandCardBody}>
              Discover signature flavors, follow rapid real-time delivery timelines, and explore fresh culinary experiences custom tailored entirely for you.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.primaryActionBtnFrame, { backgroundColor: colors?.primary || WELCOME_COLORS.primary }]}
            activeOpacity={0.85}
            onPress={onExploreApp}
            accessibilityRole="button"
            accessibilityLabel="Start Exploring"
          >
            <Text style={styles.primaryActionBtnText}>Start Exploring</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}
/**
 * Part 3: Layout Structure Elements Style Sheets Configuration Matrix
 */

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: WELCOME_COLORS.background,
  },
  contentWorkspace: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },

  // Upper Segment Styling Layout Properties
  successGraphicWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 20,
  },
  successOuterCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  successInnerCore: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
    shadowColor: WELCOME_COLORS.successGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  mainHeadingTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: WELCOME_COLORS.charcoal,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtextSupportParagraph: {
    fontSize: 14,
    fontWeight: '400',
    color: WELCOME_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 24,
  },

  // Lower Segment Styling Layout Properties
  footerActionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  brandCardBackdrop: {
    width: '100%',
    backgroundColor: WELCOME_COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: WELCOME_COLORS.border,
    marginBottom: 32,
  },
  brandCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: WELCOME_COLORS.charcoal,
    marginBottom: 6,
    letterSpacing: 0.1,
  },
  brandCardBody: {
    fontSize: 13,
    fontWeight: '400',
    color: WELCOME_COLORS.textMuted,
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
});
