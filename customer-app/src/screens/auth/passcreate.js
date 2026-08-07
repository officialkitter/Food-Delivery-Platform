/**
 * Buza Food Delivery Mobile Application
 * Secure Password Creation & Validation View
 * src/screens/passcreate.js
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

const PASS_COLORS = {
  primary: '#D62246',       // Main brand corporate accent
  charcoal: '#1E1E24',      // Dark typographic title focus
  background: '#FFFFFF',    // Screen container baseline background
  surface: '#F8FAFC',       // Input field inner container fill
  border: '#E2E8F0',        // Inactive boundary line separation
  textMuted: '#64748B',     // Accessible body text label color
  successGreen: '#16A34A',  // Validation parameter satisfied tone
  errorRed: '#DC2626'       // Non-blaming alert indicator color
};
/**
 * Part 2: Main Component Architecture, Focus Listeners, and Requirement Matrix Engines
 */

export default function PasswordCreateScreen({ onPasswordConfigured }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Primary input text state configurations
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Interface action response state handlers
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  // Real-time security criteria verification selectors
  const rules = {
    hasLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasMatch: password.length > 0 && password === confirmPassword
  };

  const handlePasswordSubmission = () => {
    setErrorMessage('');
    if (!rules.hasLength || !rules.hasNumber) {
      setErrorMessage('Please ensure your password satisfies all security criteria profiles.');
      return;
    }
    if (!rules.hasMatch) {
      setErrorMessage('Password entries do not match. Please verify your details.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onPasswordConfigured) {
        onPasswordConfigured({ password });
      }
    }, 1500);
  };

  const renderRequirementRow = (label, satisfied) => (
    <View style={styles.requirementRow}>
      <CustomIcon 
        name={satisfied ? "checkmark-circle" : "radio-button-off"} 
        size={16} 
        color={satisfied ? PASS_COLORS.successGreen : PASS_COLORS.textMuted} 
        style={styles.requirementIconSpacing}
      />
      <Text style={[styles.requirementText, satisfied && { color: PASS_COLORS.successGreen }]}>
        {label}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.masterContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollWorkspace} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.contentWorkspace, { paddingTop: insets.top + 32, paddingBottom: Math.max(insets.bottom, 20), opacity: fadeElementAnim }]}>
          
          <View style={styles.formContainer}>
            <Text style={styles.headingTitleText}>Create Secure Password</Text>
            <Text style={styles.subtextSupportText}>Set up a password parameters profile to secure your BUZA account access layers.</Text>

            {errorMessage ? (
              <View style={styles.errorDisplayBanner}>
                <Text style={styles.errorDisplayBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Input Row Segment A: Primary Password Fields */}
            <View style={[styles.passwordFieldRowWrapper, focusedField === 'pass' && { borderColor: colors?.primary || PASS_COLORS.primary }]}>
              <TextInput 
                style={styles.passwordInputFieldElement} 
                placeholder="New Password" 
                placeholderTextColor={PASS_COLORS.textMuted} 
                secureTextEntry={!showPassword} 
                value={password} 
                onChangeText={setPassword} 
                autoCapitalize="none" 
                autoCorrect={false} 
                onFocus={() => setFocusedField('pass')} 
                onBlur={() => setFocusedField(null)}
                editable={!loading}
              />
              <TouchableOpacity style={styles.passwordToggleEyeAnchor} onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                <CustomIcon name={showPassword ? "eye-off" : "eye"} size={20} color={PASS_COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Input Row Segment B: Confirmation Password Fields */}
            <View style={[styles.passwordFieldRowWrapper, focusedField === 'confirm' && { borderColor: colors?.primary || PASS_COLORS.primary }]}>
              <TextInput 
                style={styles.passwordInputFieldElement} 
                placeholder="Confirm Password" 
                placeholderTextColor={PASS_COLORS.textMuted} 
                secureTextEntry={!showConfirmPassword} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                autoCapitalize="none" 
                autoCorrect={false} 
                onFocus={() => setFocusedField('confirm')} 
                onBlur={() => setFocusedField(null)}
                editable={!loading}
              />
              <TouchableOpacity style={styles.passwordToggleEyeAnchor} onPress={() => setShowConfirmPassword(!showConfirmPassword)} activeOpacity={0.7}>
                <CustomIcon name={showConfirmPassword ? "eye-off" : "eye"} size={20} color={PASS_COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Micro-interaction Security Matrix Parameters */}
            <View style={styles.securityMatrixContainer}>
              {renderRequirementRow('Minimum 8 characters length configuration', rules.hasLength)}
              {renderRequirementRow('Contains at least one numeric digit value (0-9)', rules.hasNumber)}
              {renderRequirementRow('Both credential fields match exactly', rules.hasMatch)}
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.primaryActionButtonFrame, { backgroundColor: colors?.primary || PASS_COLORS.primary }, loading && { opacity: 0.6 }]} 
            activeOpacity={0.85} 
            onPress={handlePasswordSubmission}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.primaryActionText}>Save and Continue</Text>
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
    backgroundColor: PASS_COLORS.background,
  },
  scrollWorkspace: {
    flexGrow: 1,
  },
  contentWorkspace: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  formContainer: {
    width: '100%',
  },
  headingTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: PASS_COLORS.charcoal,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtextSupportText: {
    fontSize: 13,
    fontWeight: '400',
    color: PASS_COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 24,
  },
  errorDisplayBanner: {
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: PASS_COLORS.errorRed,
  },
  errorDisplayBannerText: {
    color: PASS_COLORS.errorRed,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  passwordFieldRowWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: PASS_COLORS.border,
    backgroundColor: PASS_COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  passwordInputFieldElement: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: PASS_COLORS.charcoal,
  },
  passwordToggleEyeAnchor: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  securityMatrixContainer: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementIconSpacing: {
    marginRight: 8,
  },
  requirementText: {
    fontSize: 13,
    fontWeight: '500',
    color: PASS_COLORS.textMuted,
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
