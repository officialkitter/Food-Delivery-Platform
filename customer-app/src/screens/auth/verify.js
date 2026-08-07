/**
 * Buza Food Delivery Mobile Application
 * Secure OTP Verification Input View
 * src/screens/verify.js
 * 
 * Part 1: Core Layout Imports and Design System Style Constants
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width } = Dimensions.get('window');

const VERIFY_COLORS = {
  primary: '#D62246',       // Main brand corporate accent
  charcoal: '#1E1E24',      // Dark typographic title focus
  background: '#FFFFFF',    // Screen container baseline background
  surface: '#F8FAFC',       // Input field inner container fill
  border: '#E2E8F0',        // Inactive boundary line separation
  textMuted: '#64748B',     // Accessible body text label color
  errorRed: '#DC2626'       // Non-blaming alert indicator color
};
/**
 * Part 2: Main Component Architecture, Focused TextInputs, and Pipeline Handlers
 */

export default function OTPVerifyScreen({ onVerificationSuccess, onResendRequested, onReturnBack }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Primary input text state configurations for a split code entry layout
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);

  // Interface action response state handlers
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Layout micro-interaction entry animation drivers
  const fadeElementAnim = useRef(new Animated.Value(0)).current;
  
  // References to handle programmatic focus shifting between inputs
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    Animated.timing(fadeElementAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();

    // Countdown loop for code retransmission intervals
    const countdown = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [fadeElementAnim]);

  const handleOtpChange = (text, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = text;
    setOtp(updatedOtp);
    setErrorMessage('');

    // Programmatically push focus forward if value is input
    if (text.length > 0 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    // Move focus backward if backspace is pressed on an empty cell
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerifySubmission = () => {
    setErrorMessage('');
    const standardCodeValue = otp.join('');

    if (standardCodeValue.length < 4) {
      setErrorMessage('Please enter the complete 4-digit verification code to proceed.');
      return;
    }

    setLoading(true);

    // Connection Point: Ready to link with real backend validation endpoint
    setTimeout(() => {
      setLoading(false);
      if (onVerificationSuccess) {
        onVerificationSuccess({ code: standardCodeValue });
      }
    }, 1600);
  };

  const triggerResendSequence = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    if (onResendRequested) {
      onResendRequested();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.masterContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollWorkspace} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 32, paddingBottom: Math.max(insets.bottom, 20), opacity: fadeElementAnim }]}>
          
          <View style={styles.formContainer}>
            <TouchableOpacity style={styles.backNavigationRowBtn} onPress={onReturnBack} activeOpacity={0.7}>
              <CustomIcon name="arrow-back" size={20} color={VERIFY_COLORS.charcoal} />
            </TouchableOpacity>

            <Text style={styles.headingTitleText}>Security Verification</Text>
            <Text style={styles.subtextSupportText}>Enter the 4-digit verification code sent to your registered contact channel to securely finalize authentication parameters.</Text>

            {errorMessage ? (
              <View style={styles.errorDisplayBanner}>
                <Text style={styles.errorDisplayBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Split Grid Box Matrix Section for OTP Characters */}
            <View style={styles.otpGridWrapper}>
              {otp.map((digit, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.otpInputCell, 
                    focusedIndex === index && { borderColor: colors?.primary || VERIFY_COLORS.primary }
                  ]}
                >
                  <TextInput
                    ref={inputRefs[index]}
                    style={styles.otpInputFieldElement}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(text) => handleOtpChange(text, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    editable={!loading}
                    selectTextOnFocus
                  />
                </View>
              ))}
            </View>

            {/* Retransmission Timer Controls Segment */}
            <View style={styles.resendTimerRow}>
              {resendTimer > 0 ? (
                <Text style={styles.timerCountdownText}>Resend code in {resendTimer}s</Text>
              ) : (
                <TouchableOpacity onPress={triggerResendSequence} activeOpacity={0.7}>
                  <Text style={[styles.resendActionLinkText, { color: colors?.primary || VERIFY_COLORS.primary }]}>Resend Verification Code</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.primaryActionButtonFrame, { backgroundColor: colors?.primary || VERIFY_COLORS.primary }, loading && { opacity: 0.6 }]} 
            activeOpacity={0.85} 
            onPress={handleVerifySubmission}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryActionText}>Verify and Continue</Text>
            )}
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
/**
 * Part 3: Explicit Layout Elements Style Sheets Matrix
 */

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: VERIFY_COLORS.background,
  },
  scrollWorkspace: {
    flexGrow: 1,
  },
  contentWorkspace: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  backNavigationRowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: VERIFY_COLORS.surface,
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  headingTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: VERIFY_COLORS.charcoal,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtextSupportText: {
    fontSize: 13,
    fontWeight: '400',
    color: VERIFY_COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 32,
  },
  errorDisplayBanner: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: VERIFY_COLORS.errorRed,
  },
  errorDisplayBannerText: {
    color: VERIFY_COLORS.errorRed,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  otpGridWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  otpInputCell: {
    width: 56,
    height: 58,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: VERIFY_COLORS.border,
    backgroundColor: VERIFY_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpInputFieldElement: {
    width: '100%',
    height: '100%',
    fontSize: 22,
    fontWeight: '700',
    color: VERIFY_COLORS.charcoal,
    textAlign: 'center',
    padding: 0,
  },
  resendTimerRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  timerCountdownText: {
    fontSize: 13,
    fontWeight: '500',
    color: VERIFY_COLORS.textMuted,
  },
  resendActionLinkText: {
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  primaryActionButtonFrame: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    minHeight: 48,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
