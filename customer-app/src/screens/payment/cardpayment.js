/**
 * Buza Food Delivery Mobile Application
 * Core Secure Credit/Debit Card Payment Processing View
 * File: src/screens/cardpayment.js (Part 1 of 3)
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

const CARD_COLORS = {
  primary: '#FF7F50', background: '#FFFFFF', textDark: '#052A30',
  textMuted: '#1E6B7B', surfaceLight: '#F7FAFA', borderLine: '#EAF2F2',
  successGreen: '#4CD964', cardGradient: '#1A363A'
};
/**
 * Buza Food Delivery Mobile Application
 * Core Secure Credit/Debit Card Payment Processing View
 * File: src/screens/cardpayment.js (Part 2 of 3)
 */

export default function CardPaymentScreen({
  totalAmountValue = 18.90,
  onPaymentSuccessRoute,
  onAbortPaymentPress
}) {
  const insets = useSafeAreaInsets();
  useTheme();

  // --- Core Intake Field States ---
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
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

  // Structural input value string sequence dynamic formatters
  const formatCardNumberString = (text) => {
    const rawDigits = text.replace(/\D/g, '');
    const alignedChunks = rawDigits.match(/.{1,4}/g);
    setCardNumber(alignedChunks ? alignedChunks.join(' ').substring(0, 19) : rawDigits);
  };

  const formatExpiryString = (text) => {
    const rawDigits = text.replace(/\D/g, '');
    if (rawDigits.length >= 2) {
      setCardExpiry(`${rawDigits.substring(0, 2)}/${rawDigits.substring(2, 4)}`);
    } else {
      setCardExpiry(rawDigits);
    }
  };

  const handleCheckoutSubmission = async () => {
    if (!cardNumber || !cardExpiry || !cardCvv) return;
    setIsProcessing(true);

    try {
      await paymentService.authorizePayment({
        orderId: null,
        amount: Number(totalAmountValue) || 0,
        method: 'card',
        channel: 'card-entry',
      });
      setIsProcessing(false);
      onPaymentSuccessRoute?.();
    } catch (error) {
      setIsProcessing(false);
      Alert.alert('Payment Error', error?.message || 'Unable to authorize card payment right now.');
    }
  };
  /**
 * Buza Food Delivery Mobile Application
 * Core Secure Credit/Debit Card Payment Processing View
 * File: src/screens/cardpayment.js (Part 3 of 3)
 */

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.masterContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* Video-Style Flowing Premium Floating Icons Background */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.backgroundMeshOrbTop} />
        <View style={styles.backgroundMeshOrbBottom} />
        <Animated.View style={[styles.floatingVectorWrapper, { left: '12%', transform: [{ translateY: backgroundDriftY }] }]}>
          <CustomIcon name="shield-check" size={24} color={CARD_COLORS.primary + '15'} />
        </Animated.View>
      </View>

      <Animated.View style={[styles.viewportWorkspace, { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10, opacity: layoutFadeAnim }]}>
        
        {/* Navigation Header bar */}
        <View style={styles.topNavigationRibbon}>
          <TouchableOpacity style={styles.roundHeaderBackAnchor} onPress={onAbortPaymentPress}>
            <CustomIcon name="arrow-left" size={18} color={CARD_COLORS.textDark} />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.checkoutLabelHeading}>SECURE CHECKOUT</Text>
            <Text style={styles.payableValueHeader}>{formatTZS(totalAmountValue)}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingVertical: 10 }} showsVerticalScrollIndicator={false} bounces={false}>
          
          {/* High-Fidelity Skeuomorphic Virtual Digital Debit Card Display */}
          <View style={styles.virtualCardFrame}>
            <View style={styles.rowSpaceBetween}>
              <CustomIcon name="shield-check" size={24} color="#FFFFFF" />
              <Text style={styles.virtualCardVendorLabel}>BUZA PREMIUM</Text>
            </View>
            <Text style={styles.virtualCardDisplayNumber}>
              {cardNumber || '•••• •••• •••• ••••'}
            </Text>
            <View style={[styles.rowSpaceBetween, { marginTop: 'auto' }]}>
              <View>
                <Text style={styles.virtualCardMetaTitle}>CARD HOLDER</Text>
                <Text style={styles.virtualCardMetaValue} numberOfLines={1}>{cardHolder.toUpperCase() || 'CLIENT PROFILE'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.virtualCardMetaTitle}>EXPIRES</Text>
                <Text style={styles.virtualCardMetaValue}>{cardExpiry || 'MM/YY'}</Text>
              </View>
            </View>
          </View>

          {/* Secure Intake Inputs Fields Matrix */}
          <View style={styles.inputContainerMatrix}>
            <View style={styles.pillInputFieldWrapper}>
              <CustomIcon name="profile" size={16} color={CARD_COLORS.textMuted} style={{ marginRight: 10 }} />
              <TextInput style={styles.textInputFieldNode} placeholder="Cardholder Full Name" placeholderTextColor={CARD_COLORS.textMuted + '70'} value={cardHolder} onChangeText={setCardHolder} autoCapitalize="characters" />
            </View>

            <View style={styles.pillInputFieldWrapper}>
              <CustomIcon name="lock" size={16} color={CARD_COLORS.textMuted} style={{ marginRight: 10 }} />
              <TextInput style={styles.textInputFieldNode} placeholder="Card Number" placeholderTextColor={CARD_COLORS.textMuted + '70'} keyboardType="numeric" value={cardNumber} onChangeText={formatCardNumberString} maxLength={19} />
            </View>

            <View style={styles.rowSpaceBetween}>
              <View style={[styles.pillInputFieldWrapper, { width: '48%' }]}>
                <CustomIcon name="calendar" size={16} color={CARD_COLORS.textMuted} style={{ marginRight: 10 }} />
                <TextInput style={styles.textInputFieldNode} placeholder="MM/YY" placeholderTextColor={CARD_COLORS.textMuted + '70'} keyboardType="numeric" value={cardExpiry} onChangeText={formatExpiryString} maxLength={5} />
              </View>

              <View style={[styles.pillInputFieldWrapper, { width: '48%' }]}>
                <CustomIcon name="eye-off" size={16} color={CARD_COLORS.textMuted} style={{ marginRight: 10 }} />
                <TextInput style={styles.textInputFieldNode} placeholder="CVV" placeholderTextColor={CARD_COLORS.textMuted + '70'} keyboardType="numeric" secureTextEntry value={cardCvv} onChangeText={setCardCvv} maxLength={3} />
              </View>
            </View>
          </View>

          {/* Encrypted Gateway Assertion Compliance Footer Line */}
          <View style={styles.complianceRibbonRow}>
            <CustomIcon name="shield-check" size={12} color={CARD_COLORS.successGreen} style={{ marginRight: 6 }} />
            <Text style={styles.complianceTextCopy}>PCI-DSS Compliant 256-Bit SSL Secured Platform</Text>
          </View>

        </ScrollView>

        {/* Primary Call-To-Action Execution Key (100% Round Pill Checkout Trigger) */}
        <TouchableOpacity 
          style={[styles.primaryPaymentActionButtonPill, (isProcessing || !cardNumber || !cardExpiry || !cardCvv) && { opacity: 0.6 }]} 
          activeOpacity={0.85} 
          onPress={handleCheckoutSubmission}
          disabled={isProcessing || !cardNumber || !cardExpiry || !cardCvv}
        >
          <Text style={styles.primaryActionButtonText}>
            {isProcessing ? "Verifying Transaction Protocol..." : `Authorize Payment ${formatTZS(totalAmountValue)}`}
          </Text>
        </TouchableOpacity>

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  masterContainer: { flex: 1, backgroundColor: CARD_COLORS.background },
  viewportWorkspace: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  rowSpaceBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
  
  // Ambient Mesh Background Architecture Rules
  backgroundMeshOrbTop: { position: 'absolute', top: -40, right: -50, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(5, 42, 48, 0.03)' },
  backgroundMeshOrbBottom: { position: 'absolute', bottom: -60, left: -40, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 127, 80, 0.04)' },
  floatingVectorWrapper: { position: 'absolute', opacity: 0.8 },

  // Top Structural Navigation Ribbons
  topNavigationRibbon: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: CARD_COLORS.borderLine, marginBottom: 10 },
  roundHeaderBackAnchor: { width: 44, height: 44, borderRadius: 22, backgroundColor: CARD_COLORS.surfaceLight, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: CARD_COLORS.borderLine },
  checkoutLabelHeading: { fontSize: 9, fontWeight: '800', color: CARD_COLORS.textMuted, letterSpacing: 0.5 },
  payableValueHeader: { fontSize: 18, fontWeight: '900', color: CARD_COLORS.textDark, marginTop: 2 },

  // Virtual Card Presentation Frame
  virtualCardFrame: { width: '100%', height: 190, backgroundColor: CARD_COLORS.cardGradient, borderRadius: 20, padding: 20, shadowColor: CARD_COLORS.textDark, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 4, marginBottom: 24 },
  virtualCardVendorLabel: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  virtualCardDisplayNumber: { color: '#FFFFFF', fontSize: 19, fontWeight: '700', letterSpacing: 2, marginTop: 32, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  virtualCardMetaTitle: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  virtualCardMetaValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', maxWidth: DEVICE_WIDTH * 0.45 },

  // Intake Input Field Matrices (100% Circular Pills)
  inputContainerMatrix: { width: '100%', gap: 12 },
  pillInputFieldWrapper: { flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 24, backgroundColor: CARD_COLORS.surfaceLight, borderWidth: 1, borderColor: CARD_COLORS.borderLine, paddingHorizontal: 16 },
  textInputFieldNode: { flex: 1, fontSize: 14, color: CARD_COLORS.textDark, fontWeight: '600', padding: 0 },

  // Compliance Layout Line
  complianceRibbonRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20 },
  complianceTextCopy: { fontSize: 11, fontWeight: '700', color: CARD_COLORS.textMuted },

  // 100% Circular Primary Call-To-Action Pill Key
  primaryPaymentActionButtonPill: { width: '100%', height: 54, borderRadius: 27, backgroundColor: CARD_COLORS.primary, alignItems: 'center', justifyContent: 'center', shadowColor: CARD_COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4, marginTop: 10 },
  primaryActionButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});

