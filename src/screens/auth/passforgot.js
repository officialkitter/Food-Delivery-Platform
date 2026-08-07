/**
 * Buza Food Delivery Mobile Application
 * Password Forgot Recovery View
 * src/screens/passforgot.js
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

const FORGOT_COLORS = {
  primary: '#D62246',       // Main brand corporate accent
  charcoal: '#1E1E24',      // Dark typographic title focus
  background: '#FFFFFF',    // Screen container baseline background
  surface: '#F8FAFC',       // Input field inner container fill
  border: '#E2E8F0',        // Inactive boundary line separation
  textMuted: '#64748B',     // Accessible body text label color
  errorRed: '#DC2626'       // Non-blaming alert indicator color
};
/**
 * Part 2: Main Component Architecture, Input Validation, and Pipeline Handlers
 */

export default function PassForgotScreen({ onRecoveryInitiated, onReturnToLogin }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Primary input text state configuration
  const [identityInput, setIdentityInput] = useState('');

  // Interface action response state handlers
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Layout micro-interaction entry animation drivers
  const fadeElementAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeElementAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  }, [fadeElementAnim]);

  const handleRecoverySubmission = () => {
    setErrorMessage('');
    
    if (!identityInput.trim()) {
      setErrorMessage('Please enter your email address or phone number to continue.');
      return;
    }

    setLoading(true);
    
    // Connection Point: Ready to link with real backend API request pipeline
    setTimeout(() => {
      setLoading(false);
      if (onRecoveryInitiated) {
        onRecoveryInitiated({ identityInput });
      }
    }, 1600);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.masterContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollWorkspace} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 32, paddingBottom: Math.max(insets.bottom, 20), opacity: fadeElementAnim }]}>
          
          <View style={styles.formContainer}>
            {/* Top Back Asset Indicator Hook */}
            <TouchableOpacity style={styles.backNavigationRowBtn} onPress={onReturnToLogin} activeOpacity={0.7}>
              <CustomIcon name="arrow-back" size={20} color={FORGOT_COLORS.charcoal} />
            </TouchableOpacity>

            <Text style={styles.headingTitleText}>Forgot Password</Text>
            <Text style={styles.subtextSupportText}>Enter your account email address or phone number. We will send you verification instructions to recover your credentials profile access.</Text>

            {errorMessage ? (
              <View style={styles.errorDisplayBanner}>
                <Text style={styles.errorDisplayBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Input Row Segment: Account Identification Field */}
            <View style={[styles.inputGroupContainer, focusedField === 'identity' && { borderColor: FORGOT_COLORS.primary }]}> 
              <Text style={styles.fieldInputLabel}>Email or phone number</Text>
              <TextInput
                style={styles.accessibleInputField}
                placeholder="name@example.com or phone number"
                placeholderTextColor={FORGOT_COLORS.textMuted}
                value={identityInput}
                onChangeText={setIdentityInput}
                onFocus={() => setFocusedField('identity')}
                onBlur={() => setFocusedField(null)}
                editable={!loading}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          {/* Primary Action Button: Dispatch Recovery Trigger */}
          <TouchableOpacity 
            style={[styles.primaryActionButtonFrame, { backgroundColor: colors?.primary || FORGOT_COLORS.primary }, loading && { opacity: 0.6 }]} 
            activeOpacity={0.85} 
            onPress={handleRecoverySubmission}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryActionText}>Send Verification Link</Text>
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
    backgroundColor: FORGOT_COLORS.background,
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
    backgroundColor: FORGOT_COLORS.surface,
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
  },
  headingTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: FORGOT_COLORS.charcoal,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtextSupportText: {
    fontSize: 13,
    fontWeight: '400',
    color: FORGOT_COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 24,
  },
  errorDisplayBanner: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: FORGOT_COLORS.errorRed,
  },
  errorDisplayBannerText: {
    color: FORGOT_COLORS.errorRed,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  inputGroupContainer: {
    marginBottom: 16,
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: FORGOT_COLORS.border,
    backgroundColor: FORGOT_COLORS.surface,
  },
  fieldInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: FORGOT_COLORS.charcoal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingLeft: 16,
    paddingTop: 8,
  },
  accessibleInputField: {
    width: '100%',
    height: 44,
    paddingHorizontal: 16,
    fontSize: 15,
    color: FORGOT_COLORS.charcoal,
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
