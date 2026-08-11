/**
 * Buza Food Delivery Mobile Application
 * Core Cash on Delivery (COD) Verification Hub
 * File: src/screens/cashondelivry.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ScrollView, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';
import { paymentService } from '../../services/paymentService';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const CASH_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964'
};
/**
 * Buza Food Delivery Mobile Application
 * Core Cash on Delivery (COD) Verification Hub
 * File: src/screens/cashondelivry.js (Part 2 of 3)
 */

export default function CashOnDeliveryScreen({
  payableTotalAmount = 18.90,
  deliveryStreetAddress = "City Center, Block 4",
  onConfirmOrderPress,
  onCancelSelectionPress
}) {
  const insets = useSafeAreaInsets();
  useTheme();

  // --- Core State Controllers ---
  const [isProcessing, setIsProcessing] = useState(false);
  const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

  // --- Animation Vector References ---
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

  const handleOrderFinalization = async () => {
    setIsProcessing(true);

    try {
      await paymentService.authorizePayment({
        orderId: null,
        amount: Number(payableTotalAmount) || 0,
        method: 'cash_on_delivery',
        channel: 'courier-cash',
      });
      setIsProcessing(false);
      onConfirmOrderPress?.();
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Payment Error', error?.message || 'Unable to register cash-on-delivery payment right now.');
    }
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Cash on Delivery (COD) Verification Hub
 * File: src/screens/cashondelivry.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="delivery-scooter" size={24} color={CASH_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onCancelSelectionPress}>
            <CustomIcon name="arrow-left" size={18} color={CASH_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.methodLabelHeading}>PAYMENT METHOD</Text>
            <Text style={styles.methodTitleText}>Cash on Delivery</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* Main Informational Icon Badge Container */}
          <View style={styles.centralIconFrameWorkspace}>
            <View style={styles.walletIconCircle}>
              <CustomIcon name="cart" size={36} color={CASH_COLORS.primary} />
            </View>
            <Text style={styles.mainVerificationPrompt}>Confirm Cash Order</Text>
            <Text style={styles.instructionContextCopy}>Please prepare the exact aggregate total balance when the courier arrives at your location destination.</Text>
          </View>

          {/* Structured Parameter Receipts Summary Panels */}
          <View style={styles.receiptSummaryBreakdownCard}>
            <View style={[styles.rowSpaceBetween, { marginBottom: 12 }]}>
              <Text style={styles.receiptItemLabel}>Delivery Destination</Text>
              <Text style={styles.receiptItemValue} numberOfLines={1}>{deliveryStreetAddress}</Text>
            </View>
            <View style={[styles.rowSpaceBetween, { borderTopWidth: 1, borderTopColor: CASH_COLORS.borderLine, paddingTop: 12 }]}>
              <Text style={styles.grandTotalLabel}>Total Amount Payable</Text>
              <Text style={styles.grandTotalValue}>{formatTZS(payableTotalAmount)}</Text>
            </View>
          </View>

          {/* Secure Policy Assertion Message Row */}
          <View style={styles.policyComplianceRibbon}>
            <CustomIcon name="shield-check" size={12} color={CASH_COLORS.successGreen} style={{ marginRight: 6 }} />
            <Text style={styles.policyComplianceCopy}>Verified Cash Payment Fulfillment Protocol</Text>
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Formats) */}
        <View style={styles.lowerActionPanelGroup}>
          <TouchableOpacity 
            style={[styles.primaryPaymentActionButtonPill, isProcessing && { opacity: 0.6 }]} 
            activeOpacity={0.85} 
            onPress={handleOrderFinalization}
            disabled={isProcessing}
          >
            <Text style={styles.primaryActionButtonText}>
              {isProcessing ? "Confirming Order Dispatch..." : "Place Cash on Delivery Order"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryActionButtonPill} activeOpacity={0.75} onPress={onCancelSelectionPress}>
            <Text style={styles.secondaryActionButtonText}>Select Alternative Method</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: CASH_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: CASH_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: CASH_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CASH_COLORS.borderLine },
  methodLabelHeading: { fontSize: 9, fontWeight: '800', color: CASH_COLORS.textMuted, letterSpacing: 0.5 },
  methodTitleText: { fontSize: 14, fontWeight: '800', color: CASH_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  scrollContentLayout: { paddingVertical: 10, alignItems: 'center' },
  centralIconFrameWorkspace: { width: '100%', alignItems: 'center', marginVertical: 16, paddingHorizontal: 8 },
  walletIconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: CASH_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CASH_COLORS.borderLine, marginBottom: 16 },
  mainVerificationPrompt: { fontSize: 20, fontWeight: '900', color: CASH_COLORS.textDark, letterSpacing: -0.2 },
  instructionContextCopy: { fontSize: 13, fontWeight: '500', color: CASH_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // Structured Information Cards Layout Rules
  receiptSummaryBreakdownCard: { width: '100%', backgroundColor: CASH_COLORS.surfaceLight, borderRadius: 20, borderWidth: 1, borderColor: CASH_COLORS.borderLine, padding: 18, marginTop: 10, shadowColor: CASH_COLORS.textDark, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  receiptItemLabel: { fontSize: 13, fontWeight: '600', color: CASH_COLORS.textMuted },
  receiptItemValue: { fontSize: 13, fontWeight: '700', color: CASH_COLORS.textDark, maxWidth: DEVICE_WIDTH * 0.45 },
  grandTotalLabel: { fontSize: 14, fontWeight: '800', color: CASH_COLORS.textDark },
  grandTotalValue: { fontSize: 16, fontWeight: '900', color: CASH_COLORS.primary, letterSpacing: -0.1 },

  // Policy Compliance Text Layout Rules
  policyComplianceRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 24 },
  policyComplianceCopy: { fontSize: 11, fontWeight: '700', color: CASH_COLORS.textMuted },

  // Lower Action Panel Layout Clusters (100% Round Circle Pill Formats)
  lowerActionPanelGroup: { width: '100%', gap: 10 },
  primaryPaymentActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: CASH_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: CASH_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  secondaryActionButtonPill: { width: '100%', height: 52, borderRadius: 26, backgroundColor: CASH_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CASH_COLORS.borderLine },
  secondaryActionButtonText: { color: CASH_COLORS.textDark, fontSize: 14, fontWeight: '700' }
});
