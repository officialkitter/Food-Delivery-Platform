/**
 * Buza Food Delivery Mobile Application
 * Core Transaction Verification & Payment Success State View
 * File: src/screens/paysuccess.js (Part 1 of 3)
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const SUCCESS_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964'
};
/**
 * Buza Food Delivery Mobile Application
 * Core Transaction Verification & Payment Success State View
 * File: src/screens/paysuccess.js (Part 2 of 3)
 */

export default function PaySuccessScreen({
  paidAmountValue = 18.90,
  transactionReference = "TXN-7740192X",
  onTrackOrderPress,
  onBackToMarketplacePress
}) {
  const insets = useSafeAreaInsets();
  useTheme();

  // --- Animation Vector Channels ---
  const layoutFadeAnim = useRef(new Animated.Value(0)).current;
  const centerpieceScaleAnim = useRef(new Animated.Value(0.8)).current;
  const centerpieceOpacityAnim = useRef(new Animated.Value(0)).current;
  const backgroundDriftY = useRef(new Animated.Value(DEVICE_HEIGHT)).current;
  const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

  useEffect(() => {
    // Entrance animations driving the central verified check asset expansion
    Animated.parallel([
      Animated.timing(layoutFadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(centerpieceScaleAnim, { toValue: 1, duration: 750, easing: Easing.out(Easing.back(1.4)), useNativeDriver: true }),
      Animated.timing(centerpieceOpacityAnim, { toValue: 1, duration: 500, useNativeDriver: true })
    ]).start();

    // Constant video-style running vector drift loops tracking vertically
    Animated.loop(
      Animated.sequence([
        Animated.timing(backgroundDriftY, { toValue: -80, duration: 9500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(backgroundDriftY, { toValue: DEVICE_HEIGHT, duration: 0, useNativeDriver: true })
      ])
    ).start();
  }, []);
/**
 * Buza Food Delivery Mobile Application
 * Core Transaction Verification & Payment Success State View
 * File: src/screens/paysuccess.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="shield-check" size={24} color={SUCCESS_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Top Header Verification Label */}
        <View style={styles.secureBadgeHeader}>
          <CustomIcon name="shield-check" size={12} color={SUCCESS_COLORS.successGreen} style={{ marginRight: 6 }} />
          <Text style={styles.secureBadgeHeaderText}>Transaction Secured</Text>
        </View>

        {/* Centralized Success Asset & Financial Metadata */}
        <View style={styles.centralFulfillmentWorkspace}>
          <Animated.View style={[styles.successAssetContainer, { opacity: centerpieceOpacityAnim, transform: [{ scale: centerpieceScaleAnim }] }]}>
            <View style={styles.successOuterCircle}>
              <CustomIcon name="checkmark" size={44} />
            </View>
          </Animated.View>

          <Text style={styles.mainPaymentConfirmedTitle}>Payment Confirmed</Text>
          <Text style={styles.financialAmountLabel}>{formatTZS(paidAmountValue)}</Text>
          
          <View style={styles.transactionMetadataPillFrame}>
            <Text style={styles.metadataLabelText}>Receipt Ref: {transactionReference}</Text>
          </View>
        </View>

        {/* Action Panel Lower Controls (100% Round Circle Pill Formats) */}
        <View style={styles.lowerActionPanelGroup}>
          <TouchableOpacity style={styles.primaryActionButtonPill} activeOpacity={0.85} onPress={onTrackOrderPress}>
            <Text style={styles.primaryActionButtonText}>Track Order Dispatch</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButtonPill} activeOpacity={0.75} onPress={onBackToMarketplacePress}>
            <Text style={styles.secondaryActionButtonText}>Continue to Home Marketplace</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: SUCCESS_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between', alignItems: 'center' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Encrypted Header Badge Elements
  secureBadgeHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: SUCCESS_COLORS.surfaceLight, borderWidth: 1, borderColor: SUCCESS_COLORS.borderLine, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100 },
  secureBadgeHeaderText: { fontSize: 11, fontWeight: '700', color: SUCCESS_COLORS.textMuted, letterSpacing: 0.2 },

  // Central Workspace Components Layout Rules
  centralFulfillmentWorkspace: { width: '100%', alignItems: 'center', marginVertical: 20 },
  successAssetContainer: { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successOuterCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: SUCCESS_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SUCCESS_COLORS.borderLine, shadowColor: SUCCESS_COLORS.textDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1 },
  mainPaymentConfirmedTitle: { fontSize: 24, fontWeight: '900', color: SUCCESS_COLORS.textDark, letterSpacing: -0.3 },
  financialAmountLabel: { fontSize: 34, fontWeight: '900', color: SUCCESS_COLORS.primary, letterSpacing: -0.5, marginTop: 10 },
  transactionMetadataPillFrame: { backgroundColor: SUCCESS_COLORS.surfaceLight, borderWidth: 1, borderColor: SUCCESS_COLORS.borderLine, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6, marginTop: 16 },
  metadataLabelText: { fontSize: 12, fontWeight: '600', color: SUCCESS_COLORS.textMuted },

  // Lower Action Dashboard Panels (100% Round Circle Pill Formats)
  lowerActionPanelGroup: { width: '100%', gap: 10 },
  primaryActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: SUCCESS_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: SUCCESS_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryActionButtonPill: { width: '100%', height: 52, borderRadius: 26, backgroundColor: SUCCESS_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SUCCESS_COLORS.borderLine },
  secondaryActionButtonText: { color: SUCCESS_COLORS.textDark, fontSize: 14, fontWeight: '700' }
});
