/**
 * Buza Food Delivery Mobile Application
 * Core Location Setup & Positioning Authorization View
 * src/screens/locationsetup.js
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

const LOCATION_COLORS = {
  primary: '#D62246',       // Main brand accent color
  charcoal: '#1E1E24',      // Deep title text color
  background: '#FFFFFF',    // Primary screen container fill
  surface: '#F8FAFC',       // Card background shading
  border: '#E2E8F0',        // Boundary divider line color
  textMuted: '#64748B',     // Supporting description paragraph color
  accentOrange: '#E65100'   // Secondary layout status anchor
};
/**
 * Part 2: Main Component Architecture and Positioning Prompt Handlers
 */

export default function LocationSetupScreen({ onLocationConfigured, onManualAddressSelect }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [isLocating, setIsLocating] = useState(false);

  // Layout micro-interaction transition drivers
  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  const slideContentAnim = useRef(new Animated.Value(25)).current;
  const mapPinScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Parallel view entry animation configurations
    Animated.parallel([
      Animated.timing(fadeElementAnim, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(slideContentAnim, {
        toValue: 0,
        duration: 550,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();

    // Loop for continuous ambient map pin pulse motion
    Animated.loop(
      Animated.sequence([
        Animated.timing(mapPinScaleAnim, {
          toValue: 1.1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(mapPinScaleAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [fadeElementAnim, slideContentAnim, mapPinScaleAnim]);

  const handleDeviceLocationRequest = () => {
    setIsLocating(true);
    
    // Connection Point: Ready to link with native geolocation libraries (expo-location or react-native-geolocation-service)
    setTimeout(() => {
      setIsLocating(false);
      Alert.alert(
        "Location Configured",
        "Your delivery positioning context has been synchronized successfully.",
        [
          { 
            text: "Continue", 
            onPress: () => {
              if (onLocationConfigured) {
                onLocationConfigured({ autoDetect: true, coordinates: { latitude: 0.0, longitude: 0.0 } });
              }
            } 
          }
        ]
      );
    }, 1800);
  };

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={LOCATION_COLORS.background} />

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
        <View style={styles.positionPromptWrapper}>
          <Animated.View style={[styles.locationIconContainer, { transform: [{ scale: mapPinScaleAnim }] }]}>
            <View style={styles.locationIconFrostedCore}>
              <CustomIcon name="map-pin-scan" size={44} color={colors?.primary || LOCATION_COLORS.primary} />
            </View>
          </Animated.View>

          <Text style={styles.mainHeadingTitle}>Find Nearby Flavors</Text>
          <Text style={styles.subtextSupportParagraph}>
            Allow access to your device location coordinates to discover active local kitchens, signature restaurants, and live delivery updates around you.
          </Text>
        </View>

        {/* Lower Segment: Operational Guidelines and Control Actions */}
        <View style={styles.footerActionContainer}>
          <View style={styles.locationCardBackdrop}>
            <View style={styles.locationInfoRow}>
              <CustomIcon name="info-circle" size={16} color={LOCATION_COLORS.accentOrange} style={styles.infoIconPadding} />
              <Text style={styles.locationCardTitle}>Precision Delivery Accuracy</Text>
            </View>
            <Text style={styles.locationCardBody}>
              Your location coordinates mapping parameters are used strictly to provide optimal food dispatch tracking routes, estimate delivery run times, and comply with regional restaurant distribution services.
            </Text>
          </View>

          {/* Primary Action Button: Request GPS Coordinates Access */}
          <TouchableOpacity 
            style={[styles.primaryActionBtnFrame, { backgroundColor: colors?.primary || LOCATION_COLORS.primary }, isLocating && { opacity: 0.6 }]}
            activeOpacity={0.85}
            onPress={handleDeviceLocationRequest}
            disabled={isLocating}
            accessibilityRole="button"
            accessibilityLabel="Use Current Location"
          >
            <Text style={styles.primaryActionBtnText}>
              {isLocating ? "Finding coordinates..." : "Use Current Location"}
            </Text>
          </TouchableOpacity>

          {/* Secondary Action Button: Bypass and Enter Fields Manually */}
          <TouchableOpacity 
            style={styles.secondaryActionBtnFrame}
            activeOpacity={0.7}
            onPress={onManualAddressSelect}
            disabled={isLocating}
            accessibilityRole="button"
            accessibilityLabel="Enter Address Manually"
          >
            <Text style={styles.secondaryActionBtnText}>Enter Address Manually</Text>
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
    backgroundColor: LOCATION_COLORS.background,
  },
  contentWorkspace: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 26,
  },

  // Upper Area Elements Configuration Layout
  positionPromptWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 20,
  },
  locationIconContainer: {
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
  locationIconFrostedCore: {
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
    color: LOCATION_COLORS.charcoal,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtextSupportParagraph: {
    fontSize: 14,
    fontWeight: '400',
    color: LOCATION_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },

  // Lower Area Elements Configuration Layout
  footerActionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  locationCardBackdrop: {
    width: '100%',
    backgroundColor: LOCATION_COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: LOCATION_COLORS.border,
    marginBottom: 28,
  },
  locationInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIconPadding: {
    marginRight: 6,
  },
  locationCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: LOCATION_COLORS.charcoal,
    letterSpacing: 0.1,
  },
  locationCardBody: {
    fontSize: 12,
    fontWeight: '400',
    color: LOCATION_COLORS.textMuted,
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
    color: LOCATION_COLORS.textMuted,
    letterSpacing: 0.1,
  },
});
