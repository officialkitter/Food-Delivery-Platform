/**
 * Buza Food Delivery Mobile Application
 * Premium Integrated Authentication Hub Controller
 * src/screens/authHub.js
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
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { CustomIcon } from '../../components/common/CustomIcon';

const { width, height } = Dimensions.get('window');

// Application color system parameters mapping
const AUTH_COLORS = {
  primary: '#FF7F50',    // Main corporate brand color
  charcoal: '#1E1E24',   // Dark typographic title focus
  background: '#FFFFFF', // Canvas container baseline background
  surface: '#F8FAFC',    // Input components inner container fill
  border: '#E2E8F0',     // Inactive interface separation lines
  textMuted: '#64748B',  // Descriptive paragraph information text
  errorBg: '#FEF2F2',    // Operational alert frame warning background
  errorText: '#DC2626'   // Functional validation indicator label text
};

// Image assets mapping matrix configuration
const CAROUSEL_IMAGES = [
  { id: '1', source: require('../../assets/images/6.png') },
  { id: '2', source: require('../../assets/images/7.png') },
  { id: '3', source: require('../../assets/images/8.png') },
  { id: '4', source: require('../../assets/images/9.png') }
];
/**
 * Part 2: Main Component Declaration and Visual Header Image Transitions
 */

export default function AuthHubScreen({ onAuthSuccess, onExternalNavigation }) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  // Navigation panel toggle state variables
  const [activeTab, setActiveTab] = useState('SIGN_IN'); // SIGN_IN or CREATE_ACCOUNT
  const [currentStep, setCurrentStep] = useState('IDENTIFIER'); // IDENTIFIER, PASSWORD, VERIFICATION, RECOVERY, RESET_PASSWORD

  // Live input profile field data bindings
  const [identifier, setIdentifier] = useState(''); // Combined contact address field
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // Interface action response state variables
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Continuing...');
  const [errorMessage, setErrorMessage] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Parallax header graphics animation parameters
  const [imageIndex, setImageIndex] = useState(0);
  const imageScrollX = useRef(new Animated.Value(0)).current;
  const imageListRef = useRef(null);
  const visualHeightAnim = useRef(new Animated.Value(height * 0.46)).current;

  // Responsive device view adjustment constraints when the digital keyboard opens
  useEffect(() => {
    const showListener = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => {
      setKeyboardOpen(true);
      Animated.timing(visualHeightAnim, { toValue: height * 0.22, duration: 250, useNativeDriver: false }).start();
    });
    const hideListener = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      setKeyboardOpen(false);
      Animated.timing(visualHeightAnim, { toValue: height * 0.46, duration: 250, useNativeDriver: false }).start();
    });

    const timer = setInterval(() => {
      if (!keyboardOpen) {
        let nextIndex = imageIndex + 1;
        if (nextIndex >= CAROUSEL_IMAGES.length) nextIndex = 0;
        setImageIndex(nextIndex);
        imageListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 5000);

    return () => {
      showListener.remove();
      hideListener.remove();
      clearInterval(timer);
    };
  }, [imageIndex, keyboardOpen]);

  const switchPanelTabsState = (targetTab, targetStep) => {
    setErrorMessage('');
    setActiveTab(targetTab);
    setCurrentStep(targetStep);
  };
/**
 * Part 3: Form Step Pipeline Submission Event Handlers
 */

  const executeSignInPipeline = () => {
    setErrorMessage('');
    if (!identifier.trim()) {
      setErrorMessage('Please fill in your email or phone number to continue.');
      return;
    }

    if (currentStep === 'IDENTIFIER') {
      // Step A: Contact identifier submitted. Proceed forward to password parameters entry step.
      setCurrentStep('PASSWORD');
    } else if (currentStep === 'PASSWORD') {
      if (!password.trim()) {
        setErrorMessage('Please provide your password details.');
        return;
      }
      setLoading(true);
      setLoadingText('Signing you in...');
      
      // Pipeline connection point: Dispatch values to backend session registration service
      if (onAuthSuccess) {
        onAuthSuccess({ identifier, password, action: 'SIGN_IN' });
      }
    }
  };

  const executeRegistrationPipeline = () => {
    setErrorMessage('');
    if (currentStep === 'IDENTIFIER') {
      if (!fullName.trim() || !identifier.trim()) {
        setErrorMessage('Please complete all fields to set up your profile space.');
        return;
      }
      // Step B: General parameters captured. Shift view context into verification validation mode.
      setCurrentStep('VERIFICATION');
    } else if (currentStep === 'VERIFICATION') {
      if (!otpCode.trim()) {
        setErrorMessage("Please supply the verification code sent to your account destination.");
        return;
      }
      setLoading(true);
      setLoadingText('Creating your account...');

      // Pipeline connection point: Dispatch values to backend registration profile database service
      if (onAuthSuccess) {
        onAuthSuccess({ fullName, identifier, otpCode, action: 'CREATE_ACCOUNT' });
      }
    }
  };

  const executeRecoveryPipeline = () => {
    setErrorMessage('');
    if (currentStep === 'RECOVERY') {
      if (!identifier.trim()) {
        setErrorMessage('An account address identifier is required to check records.');
        return;
      }
      // Step C: Identity matched. Move to live update credential pass code parameters mode.
      setCurrentStep('RESET_PASSWORD');
    } else if (currentStep === 'RESET_PASSWORD') {
      if (!newPassword.trim()) {
        setErrorMessage('Please input a secure code configuration to update parameters.');
        return;
      }
      setLoading(true);
      setLoadingText('Updating records...');

      // Pipeline connection point: Dispatch values to backend credential modification tracking services
      if (onAuthSuccess) {
        onAuthSuccess({ identifier, newPassword, action: 'PASSWORD_RESET' });
      }
    }
  };

  const executeThirdPartySocialAuth = (providerName) => {
    setErrorMessage('');
    setLoading(true);
    setLoadingText(`Connecting to ${providerName}...`);

    // Pipeline connection point: Dispatch execution request handlers to backend authenticators
    if (onAuthSuccess) {
      onAuthSuccess({ provider: providerName, action: 'SOCIAL_AUTH' });
    }
  };
/**
 * Part 4A: Layout Form Input Renderer Routing Tree Matrix (Tabs and Sign In Views)
 */

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.masterContainer}>
      <ScrollView contentContainerStyle={styles.scrollWorkspace} keyboardShouldPersistTaps="handled">
        
        {/* Dynamic Image Header Loop Section */}
        <Animated.View style={[styles.upperVisualFrame, { height: visualHeightAnim }]}>
          <FlatList
            ref={imageListRef}
            data={CAROUSEL_IMAGES}
            renderItem={({ item }) => <Image source={item.source} style={styles.carouselImageFrame} resizeMode="cover" />}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: imageScrollX } } }], { useNativeDriver: false })}
            keyExtractor={(item) => item.id}
          />
        </Animated.View>

        {/* Lower Main Input Form Module Workspace */}
        <View style={[styles.lowerFormWorkspace, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          {currentStep !== 'RECOVERY' && currentStep !== 'VERIFICATION' && currentStep !== 'RESET_PASSWORD' && (
            <View style={styles.tabSelectorBar}>
              <TouchableOpacity style={styles.tabOptionCell} onPress={() => switchPanelTabsState('SIGN_IN', 'IDENTIFIER')} activeOpacity={0.7}>
                <Text style={[styles.tabLabelText, activeTab === 'SIGN_IN' && styles.tabLabelTextActive]}>SIGN IN</Text>
                {activeTab === 'SIGN_IN' && <View style={styles.tabActiveIndicatorLine} />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabOptionCell} onPress={() => switchPanelTabsState('CREATE_ACCOUNT', 'IDENTIFIER')} activeOpacity={0.7}>
                <Text style={[styles.tabLabelText, activeTab === 'CREATE_ACCOUNT' && styles.tabLabelTextActive]}>CREATE ACCOUNT</Text>
                {activeTab === 'CREATE_ACCOUNT' && <View style={styles.tabActiveIndicatorLine} />}
              </TouchableOpacity>
            </View>
          )}

          {/* User-friendly Error Display Area */}
          {errorMessage ? (
            <View style={styles.errorDisplayCard}><Text style={styles.errorDisplayCardText}>{errorMessage}</Text></View>
          ) : null}

          {/* Form Context Rendering Selection Router - Sign In Flows */}
          {activeTab === 'SIGN_IN' && currentStep === 'IDENTIFIER' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Welcome back</Text>
              <Text style={styles.subtextSupportText}>Your next delicious moment is only a few taps away.</Text>
              <View style={[styles.inputGroupContainer, focusedField === 'si_id' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>Email or phone number</Text>
                <TextInput style={styles.accessibleInputField} placeholder="name@example.com or phone number" placeholderTextColor={AUTH_COLORS.textMuted} value={identifier} onChangeText={setIdentifier} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('si_id')} onBlur={() => setFocusedField(null)} editable={!loading} />
              </View>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, loading && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeSignInPipeline} disabled={loading}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Continue</Text>}
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'SIGN_IN' && currentStep === 'PASSWORD' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Enter your password</Text>
              <Text style={styles.subtextSupportText}>Verify security parameters to access credentials profile safely.</Text>
              <View style={[styles.passwordFieldRowWrapper, focusedField === 'si_pass' && { borderColor: AUTH_COLORS.primary }]}>
                <TextInput style={styles.passwordInputFieldElement} placeholder="Enter password" placeholderTextColor={AUTH_COLORS.textMuted} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('si_pass')} onBlur={() => setFocusedField(null)} editable={!loading} />
                <TouchableOpacity style={styles.passwordToggleEyeAnchor} onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                  <CustomIcon name={showPassword ? "eye-off" : "eye"} size={20} color={AUTH_COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.inlineBypassLinkBtn} onPress={() => setCurrentStep('RECOVERY')} activeOpacity={0.7} disabled={loading}>
                <Text style={styles.inlineBypassLinkText}>Forgot password?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, loading && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeSignInPipeline} disabled={loading}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Sign In</Text>}
              </TouchableOpacity>
            </View>
          )}
/**
 * Part 4B: Layout Form Input Renderer Routing Tree Matrix (Registration and Account Recovery Views)
 */

          {/* Form Context Rendering Selection Router - Create Account Flows */}
          {activeTab === 'CREATE_ACCOUNT' && currentStep === 'IDENTIFIER' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Create your BUZA account</Text>
              <Text style={styles.subtextSupportText}>Good food is better when the journey is easy.</Text>
              <View style={[styles.inputGroupContainer, focusedField === 'su_name' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>Full name</Text>
                <TextInput style={styles.accessibleInputField} placeholder="John Doe" placeholderTextColor={AUTH_COLORS.textMuted} value={fullName} onChangeText={setFullName} onFocus={() => setFocusedField('su_name')} onBlur={() => setFocusedField(null)} editable={!loading} />
              </View>
              <View style={[styles.inputGroupContainer, focusedField === 'su_id' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>Email or phone number</Text>
                <TextInput style={styles.accessibleInputField} placeholder="name@example.com or phone number" placeholderTextColor={AUTH_COLORS.textMuted} value={identifier} onChangeText={setIdentifier} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('su_id')} onBlur={() => setFocusedField(null)} editable={!loading} />
              </View>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, loading && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeRegistrationPipeline} disabled={loading}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Continue</Text>}
              </TouchableOpacity>
            </View>
          )}

          {currentStep === 'VERIFICATION' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Security Verification</Text>
              <Text style={styles.subtextSupportText}>A temporary entry configuration parameter code was dispatched to your destination device path.</Text>
              <View style={[styles.inputGroupContainer, focusedField === 'otp' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>Verification Code</Text>
                <TextInput style={styles.accessibleInputField} placeholder="Enter verification code" placeholderTextColor={AUTH_COLORS.textMuted} keyboardType="number-pad" value={otpCode} onChangeText={setOtpCode} onFocus={() => setFocusedField('otp')} onBlur={() => setFocusedField(null)} editable={!loading} />
              </View>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, loading && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeRegistrationPipeline} disabled={loading}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Continue</Text>}
              </TouchableOpacity>
            </View>
          )}

          {/* Account Recovery Flows */}
          {currentStep === 'RECOVERY' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Find my account</Text>
              <Text style={styles.subtextSupportText}>Enter your account details to recover your account parameters safely.</Text>
              <View style={[styles.inputGroupContainer, focusedField === 'rec' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>Email or phone number</Text>
                <TextInput style={styles.accessibleInputField} placeholder="name@example.com" placeholderTextColor={AUTH_COLORS.textMuted} value={identifier} onChangeText={setIdentifier} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('rec')} onBlur={() => setFocusedField(null)} editable={!loading} />
              </View>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, loading && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeRecoveryPipeline} disabled={loading}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Continue</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.inlineBypassLinkBtn} onPress={() => setCurrentStep('IDENTIFIER')} activeOpacity={0.7} disabled={loading}>
                <Text style={styles.inlineBypassLinkText}>Return to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}

          {currentStep === 'RESET_PASSWORD' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Reset password</Text>
              <Text style={styles.subtextSupportText}>Set up your updated credentials configuration profile parameters.</Text>
              <View style={[styles.inputGroupContainer, focusedField === 'new_pass' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>New Password</Text>
                <TextInput style={styles.accessibleInputField} placeholder="Enter your new password" placeholderTextColor={AUTH_COLORS.textMuted} secureTextEntry value={newPassword} onChangeText={setNewPassword} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('new_pass')} onBlur={() => setFocusedField(null)} editable={!loading} />
              </View>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, loading && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeRecoveryPipeline} disabled={loading}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Reset Password</Text>}
              </TouchableOpacity>
            </View>
          )}
          {/* Shared Content Divider Component */}
          <View style={styles.minimalistAuthDividerRow}>
            <View style={styles.dividerLineSegment} />
            <Text style={styles.dividerLabelText}>OR</Text>
            <View style={styles.dividerLineSegment} />
          </View>

          {/* Social Access Identity Providers Grid */}
          <View style={styles.socialProvidersStackLayout}>
            <TouchableOpacity style={styles.socialProviderButtonFrame} activeOpacity={0.8} onPress={() => executeThirdPartySocialAuth('Google')} disabled={loading}>
              <CustomIcon name="google-logo" size={18} color="#FF7F50" style={styles.socialIconSpacingMargin} />
              <Text style={styles.socialProviderButtonLabel}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialProviderButtonFrame} activeOpacity={0.8} onPress={() => executeThirdPartySocialAuth('Apple')} disabled={loading}>
              <CustomIcon name="apple-logo" size={18} color="#000000" style={styles.socialIconSpacingMargin} />
              <Text style={styles.socialProviderButtonLabel}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialProviderButtonFrame} activeOpacity={0.8} onPress={() => executeThirdPartySocialAuth('Facebook')} disabled={loading}>
              <CustomIcon name="facebook-logo" size={18} color="#1877F2" style={styles.socialIconSpacingMargin} />
              <Text style={styles.socialProviderButtonLabel}>Continue with Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Legal Compliance Terms Footer Block */}
          <Text style={styles.legalNoticeComplianceText}>
            By tapping Continue, you agree to BUZA's{' '}
            <Text style={styles.legalNoticeInteractiveLinkText}>Terms and Conditions</Text> and{' '}
            <Text style={styles.legalNoticeInteractiveLinkText}>Privacy Policy</Text>.
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
/**
 * Part 6: Core View Elements Style Sheets Mapping Matrix
 */

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: AUTH_COLORS.background,
  },
  scrollWorkspace: {
    flexGrow: 1,
  },
  upperVisualFrame: {
    width: width,
    position: 'relative',
    backgroundColor: AUTH_COLORS.charcoal,
  },
  carouselImageFrame: {
    width: width,
    height: '100%',
  },
  darkGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(30, 30, 36, 0.35)',
  },
  brandingBadge: {
    position: 'absolute',
    left: 20,
    zIndex: 10,
  },
  badgeFrostedCore: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '900',
    color: AUTH_COLORS.primary,
    letterSpacing: 1.5,
  },
  lowerFormWorkspace: {
    flex: 1,
    backgroundColor: AUTH_COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  tabSelectorBar: {
    flexDirection: 'row',
    height: 44,
    borderBottomWidth: 1,
    borderBottomColor: AUTH_COLORS.border,
    marginBottom: 24,
  },
  tabOptionCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelText: {
    fontSize: 13,
    fontWeight: '700',
    color: AUTH_COLORS.textMuted,
    letterSpacing: 0.5,
  },
  tabLabelTextActive: {
    color: AUTH_COLORS.primary,
  },
  tabActiveIndicatorLine: {
    position: 'absolute',
    bottom: 0,
    width: '45%',
    height: 3,
    backgroundColor: AUTH_COLORS.primary,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  errorDisplayCard: {
    backgroundColor: AUTH_COLORS.errorBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: AUTH_COLORS.errorText,
  },
  errorDisplayCardText: {
    color: AUTH_COLORS.errorText,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  formContainer: {
    width: '100%',
  },
  headingTitleText: {
    fontSize: 22,
    fontWeight: '800',
    color: AUTH_COLORS.charcoal,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtextSupportText: {
    fontSize: 13,
    fontWeight: '400',
    color: AUTH_COLORS.textMuted,
    lineHeight: 18,
    marginBottom: 24,
  },
  inputGroupContainer: {
    marginBottom: 16,
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    backgroundColor: AUTH_COLORS.surface,
  },
  inputGroupContainerActive: {
    borderColor: AUTH_COLORS.primary,
  },
  fieldInputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: AUTH_COLORS.charcoal,
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
    color: AUTH_COLORS.charcoal,
  },
  passwordFieldRowWrapper: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    backgroundColor: AUTH_COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  passwordInputFieldElement: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: AUTH_COLORS.charcoal,
  },
  passwordToggleEyeAnchor: {
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  primaryActionButtonFrame: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: AUTH_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    minHeight: 48,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  btnLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLoadingRowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 10,
  },
  inlineBypassLinkBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    marginBottom: 12,
  },
  inlineBypassLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: AUTH_COLORS.primary,
  },
  minimalistAuthDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    width: '100%',
  },
  dividerLineSegment: {
    flex: 1,
    height: 1,
    backgroundColor: AUTH_COLORS.border,
  },
  dividerLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: AUTH_COLORS.textMuted,
    paddingHorizontal: 14,
  },
  socialProvidersStackLayout: {
    width: '100%',
    marginBottom: 20,
  },
  socialProviderButtonFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    minHeight: 48,
  },
  socialIconSpacingMargin: {
    marginRight: 10,
  },
  socialProviderButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: AUTH_COLORS.charcoal,
  },
  legalNoticeComplianceText: {
    fontSize: 11,
    fontWeight: '400',
    color: AUTH_COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  legalNoticeInteractiveLinkText: {
    fontWeight: '600',
    color: AUTH_COLORS.charcoal,
    textDecorationLine: 'underline',
  },
});
