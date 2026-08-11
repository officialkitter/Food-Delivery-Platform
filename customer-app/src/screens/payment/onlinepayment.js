/**
 * Buza Food Delivery Mobile Application
 * Core Online Aggregator Payment Gateway Routing Hub
 * File: src/screens/onlinepayments.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';
import { paymentService } from '../../services/paymentService';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const ONLINE_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964'
};

const GATEWAY_METHODS = [
  { id: 'paypal', name: 'PayPal Checkout', providerIcon: 'shield-check' },
  { id: 'stripe', name: 'Stripe Pay', providerIcon: 'shield-check' },
  { id: 'apple', name: 'Apple Pay Wallet', providerIcon: 'apple' },
  { id: 'google', name: 'Google Pay Sync', providerIcon: 'google' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Online Aggregator Payment Gateway Routing Hub
 * File: src/screens/onlinepayments.js (Part 2 of 3)
 */

export default function OnlinePaymentsScreen({
  aggregatePayableSum = 18.90,
  onGatewaySuccessCallback,
  onAbortCheckoutPress
}) {
  const insets = useSafeAreaInsets();
  useTheme();

  // --- Core Configuration States ---
  const [selectedGatewayId, setSelectedGatewayId] = useState('paypal');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const formatTZS = (value) => Formatter.formatCurrency(Number(value) || 0, 'TZS');

  // --- Animation Vector Streams ---
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

  const handleExternalGatewayVerification = async () => {
    if (!selectedGatewayId) return;
    setIsAuthorizing(true);

    try {
      await paymentService.authorizePayment({
        orderId: null,
        amount: Number(aggregatePayableSum) || 0,
        method: 'online_gateway',
        channel: selectedGatewayId,
      });
      setIsAuthorizing(false);
      onGatewaySuccessCallback?.(selectedGatewayId);
    } catch (error) {
      setIsAuthorizing(false);
      Alert.alert('Payment Error', error?.message || 'Unable to authorize online payment right now.');
    }
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Online Aggregator Payment Gateway Routing Hub
 * File: src/screens/onlinepayments.js (Part 3 of 3)
 */

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="shield-check" size={24} color={ONLINE_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onAbortCheckoutPress}>
            <CustomIcon name="arrow-left" size={18} color={ONLINE_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.checkoutLabelHeading}>DIGITAL INTEGRATION</Text>
            <Text style={styles.payableValueHeader}>{formatTZS(aggregatePayableSum)}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* Top Informational Header Framework */}
          <View style={styles.centralHeaderPromptWorkspace}>
            <View style={styles.gatewayIconCircle}>
              <CustomIcon name="shield-check" size={28} color={ONLINE_COLORS.primary} />
            </View>
            <Text style={styles.mainVerificationPrompt}>Digital Payment Methods</Text>
            <Text style={styles.instructionContextCopy}>Select your secure external web wallet client protocol to authorize the transaction sum instantly.</Text>
          </View>

          {/* Vertical Stacked Selection List (100% Round Item Pill Wrappers) */}
          <View style={styles.gatewaySelectorVerticalStack}>
            {GATEWAY_METHODS.map((method) => {
              const isChosen = selectedGatewayId === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[styles.gatewayRoundRowPill, isChosen && styles.gatewayRoundRowPillActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedGatewayId(method.id)}
                >
                  <View style={styles.gatewayContentGroupLeft}>
                    <View style={styles.providerIconWrapperCircle}>
                      <CustomIcon name={method.providerIcon} size={16} color={ONLINE_COLORS.textDark} />
                    </View>
                    <Text style={[styles.gatewayMethodNameLabel, isChosen && { color: '#FFFFFF' }]}>{method.name}</Text>
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
            <CustomIcon name="shield-check" size={12} color={ONLINE_COLORS.successGreen} style={{ marginRight: 6 }} />
            <Text style={styles.complianceTextCopy}>Encrypted handshake protocol redirect verified</Text>
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Checkout Trigger Key) */}
        <TouchableOpacity 
          style={[styles.primaryPaymentActionButtonPill, (isAuthorizing || !selectedGatewayId) && { opacity: 0.5 }]} 
          activeOpacity={0.85} 
          onPress={handleExternalGatewayVerification}
          disabled={isAuthorizing || !selectedGatewayId}
        >
          {isAuthorizing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryActionButtonText}>Authorize Secure Portal Connection</Text>
          )}
        </TouchableOpacity>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: ONLINE_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: ONLINE_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: ONLINE_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ONLINE_COLORS.borderLine },
  checkoutLabelHeading: { fontSize: 9, fontWeight: '800', color: ONLINE_COLORS.textMuted, letterSpacing: 0.5 },
  payableValueHeader: { fontSize: 18, fontWeight: '900', color: ONLINE_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  scrollContentLayout: { paddingVertical: 10, alignItems: 'center', width: '100%' },
  centralHeaderPromptWorkspace: { width: '100%', alignItems: 'center', marginVertical: 12, paddingHorizontal: 4 },
  gatewayIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: ONLINE_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ONLINE_COLORS.borderLine, marginBottom: 14 },
  mainVerificationPrompt: { fontSize: 20, fontWeight: '900', color: ONLINE_COLORS.textDark, letterSpacing: -0.2 },
  instructionContextCopy: { fontSize: 13, fontWeight: '500', color: ONLINE_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // Vertical Selector Item Row Structures (100% Spherical Borders)
  gatewaySelectorVerticalStack: { width: '100%', gap: 10, marginTop: 12 },
  gatewayRoundRowPill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 54, borderRadius: 27, backgroundColor: ONLINE_COLORS.surfaceLight, borderWidth: 1, borderColor: ONLINE_COLORS.borderLine, paddingHorizontal: 16 },
  gatewayRoundRowPillActive: { backgroundColor: ONLINE_COLORS.textDark, borderColor: ONLINE_COLORS.textDark },
  gatewayContentGroupLeft: { flexDirection: 'row', alignItems: 'center' },
  providerIconWrapperCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: ONLINE_COLORS.borderLine, marginRight: 12 },
  gatewayMethodNameLabel: { fontSize: 14, fontWeight: '700', color: ONLINE_COLORS.textDark },
  
  // Custom Custom Radio Buttons (100% Round Framework Circles)
  radioCircleOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: ONLINE_COLORS.borderLine, alignItems: 'center', justifyContent: 'center' },
  radioCircleInnerCore: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' },

  // Compliance Layout Line
  complianceRibbonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 24 },
  complianceTextCopy: { fontSize: 11, fontWeight: '700', color: ONLINE_COLORS.textMuted },

  // 100% Circular Primary Call-To-Action Pill Key
  primaryPaymentActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: ONLINE_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: ONLINE_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }
});
         