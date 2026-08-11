/**
 * Buza Food Delivery Mobile Application
 * Core Secure Mobile Money Banking Payment View
 * File: src/screens/mobilepayment.js (Part 1 of 3)
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Animated, TouchableOpacity,
  StatusBar, Easing, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';
import { Formatter } from '../../shared/utils/formatters';
import { paymentService } from '../../services/paymentService';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const MOBILE_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964', overlayGold: '#FFB900'
};

const CARRIER_PROVIDERS = [
  { id: 'mpesa', name: 'M-Pesa', brandingColor: '#4CD964' },
  { id: 'airtel', name: 'Airtel Money', brandingColor: '#FF3B30' },
  { id: 'tigo', name: 'Tigo Pesa', brandingColor: '#007AFF' }
];
/**
 * Buza Food Delivery Mobile Application
 * Core Secure Mobile Money Banking Payment View
 * File: src/screens/mobilepayment.js (Part 2 of 3)
 */

export default function MobilePaymentScreen({
  totalBillPayable = 18.90,
  onPaymentFinalizedRoute,
  onAbortPaymentPress
}) {
  const insets = useSafeAreaInsets();
  useTheme();

  // --- Core Configuration States ---
  const [selectedCarrierId, setSelectedCarrierId] = useState('mpesa');
  const [subscriberNumber, setSubscriberNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
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

  const formatPhoneNumberInput = (text) => {
    const rawDigits = text.replace(/\D/g, '');
    setSubscriberNumber(rawDigits.substring(0, 10));
  };

  const handleMnoCheckoutSubmit = async () => {
    if (subscriberNumber.length < 9) return;
    setIsProcessing(true);

    try {
      await paymentService.authorizePayment({
        orderId: null,
        amount: Number(totalBillPayable) || 0,
        method: 'mobile_money',
        channel: selectedCarrierId,
      });
      setIsProcessing(false);
      onPaymentFinalizedRoute?.();
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Payment Error', error?.message || 'Unable to authorize mobile wallet payment right now.');
    }
  };
/**
 * Buza Food Delivery Mobile Application
 * Core Secure Mobile Money Banking Payment View
 * File: src/screens/mobilepayment.js (Part 3 of 3)
 */

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '15%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="shield-check" size={24} color={MOBILE_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Ribbon Bar Strip */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onAbortPaymentPress}>
            <CustomIcon name="arrow-left" size={18} color={MOBILE_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.checkoutLabelHeading}>MOBILE WALLET</Text>
            <Text style={styles.payableValueHeader}>{formatTZS(totalBillPayable)}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContentLayout} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* Top Informational Header Messaging */}
          <View style={styles.centralHeaderPromptWorkspace}>
            <View style={styles.walletIconCircle}>
              <CustomIcon name="lock" size={28} color={MOBILE_COLORS.primary} />
            </View>
            <Text style={styles.mainVerificationPrompt}>Mobile Money Gateway</Text>
            <Text style={styles.instructionContextCopy}>Select your registered cellular carrier network and enter your subscriber wallet identity coordinates below.</Text>
          </View>

          {/* Horizontal Network Carrier Selection Row (100% Round Buttons) */}
          <View style={styles.carrierGridMatrixRow}>
            {CARRIER_PROVIDERS.map((provider) => {
              const isChosen = selectedCarrierId === provider.id;
              return (
                <TouchableOpacity
                  key={provider.id}
                  style={[styles.carrierPillKey, isChosen && { borderColor: provider.brandingColor, backgroundColor: MOBILE_COLORS.surfaceLight }]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCarrierId(provider.id)}
                >
                  <View style={[styles.carrierIndicatorDot, { backgroundColor: provider.brandingColor }]} />
                  <Text style={styles.carrierLabelText}>{provider.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Secure Subscriber Digital Identification Input (100% Round Oval Frame) */}
          <View style={styles.pillInputFieldWrapper}>
            <CustomIcon name="profile" size={16} color={MOBILE_COLORS.textMuted} style={{ marginRight: 12 }} />
            <TextInput
              style={styles.textInputFieldNode}
              placeholder="Enter mobile wallet phone number..."
              placeholderTextColor={MOBILE_COLORS.textMuted + '70'}
              keyboardType="phone-pad"
              value={subscriberNumber}
              onChangeText={formatPhoneNumberInput}
              maxLength={10}
            />
          </View>

          {/* Push USSD Prompts Behavioral Compliance Notice Line */}
          <View style={styles.complianceRibbonRow}>
            <CustomIcon name="shield-check" size={12} color={MOBILE_COLORS.successGreen} style={{ marginRight: 6 }} />
            <Text style={styles.complianceTextCopy}>A secure payment execution prompt will be pushed onto your device SIM card instantly.</Text>
          </View>

        </ScrollView>

        {/* Action Panel Lower Controls (100% Round Pill Checkout Trigger) */}
        <TouchableOpacity 
          style={[styles.primaryPaymentActionButtonPill, (isProcessing || subscriberNumber.length < 9) && { opacity: 0.5 }]} 
          activeOpacity={0.85} 
          onPress={handleMnoCheckoutSubmit}
          disabled={isProcessing || subscriberNumber.length < 9}
        >
          <Text style={styles.primaryActionButtonText}>
            {isProcessing ? "Awaiting Remote STK Push Authorizations..." : "Push Secure Payment Request"}
          </Text>
        </TouchableOpacity>

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: MOBILE_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: MOBILE_COLORS.borderLine },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: MOBILE_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: MOBILE_COLORS.borderLine },
  checkoutLabelHeading: { fontSize: 9, fontWeight: '800', color: MOBILE_COLORS.textMuted, letterSpacing: 0.5 },
  payableValueHeader: { fontSize: 18, fontWeight: '900', color: MOBILE_COLORS.textDark, marginTop: 2 },

  // Central Workspace Framing Layout Rules
  scrollContentLayout: { paddingVertical: 10, alignItems: 'center' },
  centralHeaderPromptWorkspace: { width: '100%', alignItems: 'center', marginVertical: 12, paddingHorizontal: 4 },
  walletIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: MOBILE_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: MOBILE_COLORS.borderLine, marginBottom: 14 },
  mainVerificationPrompt: { fontSize: 20, fontWeight: '900', color: MOBILE_COLORS.textDark, letterSpacing: -0.2 },
  instructionContextCopy: { fontSize: 13, fontWeight: '500', color: MOBILE_COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginTop: 6 },

  // 100% Round Network Grid Buttons Layout Rules
  carrierGridMatrixRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginVertical: 16 },
  carrierPillKey: { flexDirection: 'row', width: '31%', height: 46, borderRadius: 23, backgroundColor: MOBILE_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: MOBILE_COLORS.borderLine, paddingHorizontal: 4 },
  carrierIndicatorDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  carrierLabelText: { fontSize: 12, fontWeight: '800', color: MOBILE_COLORS.textDark },

  // Secure Input Structures (100% Circular Pills)
  pillInputFieldWrapper: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24, backgroundColor: MOBILE_COLORS.surfaceLight, borderWidth: 1, borderColor: MOBILE_COLORS.borderLine, paddingHorizontal: 16, width: '100%' },
  textInputFieldNode: { flex: 1, fontSize: 14, color: MOBILE_COLORS.textDark, fontWeight: '600', padding: 0 },

  // Compliance Notice Copy Row
  complianceRibbonRow: { flexDirection: 'row', width: '100%', marginTop: 20, paddingHorizontal: 8 },
  complianceTextCopy: { flex: 1, fontSize: 11, fontWeight: '700', color: MOBILE_COLORS.textMuted, lineHeight: 16 },

  // 100% Circular Primary Call-To-Action Pill Key
  primaryPaymentActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: MOBILE_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: MOBILE_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4, marginTop: 10 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
