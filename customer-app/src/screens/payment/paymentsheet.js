/**
 * Buza Food Delivery Mobile Application
 * Core Interactive Checkout Master Payment Sheet Modal View
 * File: src/screens/paymentsheet.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ScrollView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const SHEET_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964'
};

const SHEET_METHODS = [
  { id: 'card', name: 'Credit or Debit Card', routeIcon: 'lock', description: 'Visa, Mastercard, or Amex gateway' },
  { id: 'mobile', name: 'Mobile Money Account', routeIcon: 'profile', description: 'M-Pesa, Airtel, or Tigo networks' },
  { id: 'online', name: 'Digital Web Portals', routeIcon: 'shield-check', description: 'PayPal, Stripe, or Apple Pay' },
  { id: 'cash', name: 'Cash on Delivery', routeIcon: 'delivery-scooter', description: 'Settle with courier at your door' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Interactive Checkout Master Payment Sheet Modal View
 * File: src/screens/paymentsheet.js (Part 2 of 3)
 */

export default function PaymentSheetScreen({
  grandTotalBillAmount = 18.90,
  onMethodConfirmedSelect,
  onDismissSheetPress
}) {
  const insets = useSafeAreaInsets();
  useTheme();

  // --- Core Selection States ---
  const [activeSelectedMethodId, setActiveSelectedMethodId] = useState('card');
  const [isFinalizing, setIsFinalizing] = useState(false);
  const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

  // --- Animation Vector Channels ---
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

  const handleCheckoutMethodRouting = () => {
    if (!activeSelectedMethodId) return;
    setIsFinalizing(true);
    setTimeout(() => {
      setIsFinalizing(false);
      onMethodConfirmedSelect?.(activeSelectedMethodId);
    }, 1000);
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Interactive Checkout Master Payment Sheet Modal View
 * File: src/screens/paymentsheet.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="shield-check" size={24} color={SHEET_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onDismissSheetPress}>
            <CustomIcon name="arrow-left" size={18} color={SHEET_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.checkoutLabelHeading}>CHOOSE PAYMENT</Text>
            <Text style={styles.payableValueHeader}>Total: {formatTZS(grandTotalBillAmount)}</Text>
          </View>
        </View>

        {/* Scrollable Selector Field Node Area */}
        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          <View style={styles.centralHeadingPromptWorkspace}>
            <View style={styles.sheetIconCircle}>
              <CustomIcon name="cart" size={28} color={SHEET_COLORS.primary} />
            </View>
            <Text style={styles.mainVerificationPrompt}>Select Payment Option</Text>
            <Text style={styles.instructionContextCopy}>Review the settlement channels integrated on your account and choose a payment framework route to finalize checkout.</Text>
          </View>

          {/* Vertical Stacked Selection List (100% Round Item Pill Wrappers) */}
          <View style={styles.sheetSelectorVerticalStack}>
            {SHEET_METHODS.map((method) => {
              const isChosen = activeSelectedMethodId === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.sheetRoundRowPill, isChosen && styles.sheetRoundRowPillActive]}
                  activeOpacity={0.8}
                  onPress={() => setActiveSelectedMethodId(method.id)}
                >
                  <View style={styles.sheetContentGroupLeft}>
                    <View style={styles.providerIconWrapperCircle}>
                      <CustomIcon name={method.routeIcon} size={16} color={SHEET_COLORS.textDark} />
                    </View>
                    <View>
                      <Text style={[styles.sheetMethodNameLabel, isChosen && { color: '#FFFFFF' }]}>{method.name}</Text>
                      <Text style={[styles.sheetMethodDescriptionLabel, isChosen && { color: 'rgba(255,255,255,0.6)' }]}>{method.description}</Text>
                    </View>
                  </View>
                  <View style={[styles.radioCircleOuter, isChosen && { borderColor: '#FFFFFF' }]}>
                    {isChosen && <View style={styles.radioCircleInnerCore} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Secure Web Token Encryption Compliance Footer Line */}
          <View style={styles.complianceRibbonRow}>
            <CustomIcon name="shield-check" size={12} color={SHEET_COLORS.successGreen} style={{ marginRight: 6 }} />
            <Text style={styles.complianceTextCopy}>Secure Gateway Encryption Protocols Enforced</Text>
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Master Checkout Trigger Key) */}
        <TouchableOpacity 
          style={[styles.primaryPaymentActionButtonPill, (isFinalizing || !activeSelectedMethodId) && { opacity: 0.5 }]} 
          activeOpacity={0.85} 
          onPress={handleCheckoutMethodRouting}
          disabled={isFinalizing || !activeSelectedMethodId}
        >
          <Text style={styles.primaryActionButtonText}>
            {isFinalizing ? "Configuring Checkout Pipeline..." : "Confirm Selected Payment Route"}
          </Text>
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: SHEET_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: SHEET_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: SHEET_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SHEET_COLORS.borderLine },
  checkoutLabelHeading: { fontSize: 9, fontWeight: '800', color: SHEET_COLORS.textMuted, letterSpacing: 0.5 },
  payableValueHeader: { fontSize: 16, fontWeight: '900', color: SHEET_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  scrollContentLayout: { paddingVertical: 10, alignItems: 'center', width: '100%' },
  centralHeadingPromptWorkspace: { width: '100%', alignItems: 'center', marginVertical: 12, paddingHorizontal: 4 },
  sheetIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: SHEET_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SHEET_COLORS.borderLine, marginBottom: 14 },
  mainVerificationPrompt: { fontSize: 20, fontWeight: '900', color: SHEET_COLORS.textDark, letterSpacing: -0.2 },
  instructionContextCopy: { fontSize: 13, fontWeight: '500', color: SHEET_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // Vertical Selector Item Row Structures (100% Spherical Borders)
  sheetSelectorVerticalStack: { width: '100%', gap: 10, marginTop: 12 },
  sheetRoundRowPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', minHeight: 64, borderRadius: 32, backgroundColor: SHEET_COLORS.surfaceLight, borderWidth: 1, borderColor: SHEET_COLORS.borderLine, paddingHorizontal: 16, paddingVertical: 10 },
  sheetRoundRowPillActive: { backgroundColor: SHEET_COLORS.textDark, borderColor: SHEET_COLORS.textDark },
  sheetContentGroupLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 },
  providerIconWrapperCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: SHEET_COLORS.borderLine, marginRight: 12 },
  sheetMethodNameLabel: { fontSize: 14, fontWeight: '800', color: SHEET_COLORS.textDark },
  sheetMethodDescriptionLabel: { fontSize: 11, fontWeight: '500', color: SHEET_COLORS.textMuted, marginTop: 2 },
  
  // Custom Radio Buttons (100% Round Framework Circles)
  radioCircleOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: SHEET_COLORS.borderLine, alignItems: 'center', justifyContent: 'center' },
  radioCircleInnerCore: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' },

  // Compliance Layout Line
  complianceRibbonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 24 },
  complianceTextCopy: { fontSize: 11, fontWeight: '700', color: SHEET_COLORS.textMuted },

  // 100% Circular Primary Call-To-Action Pill Key
  primaryPaymentActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: SHEET_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: SHEET_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }
});
