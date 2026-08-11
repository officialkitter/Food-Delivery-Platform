/**
 * Buza Food Delivery Mobile Application
 * Premium Integrated Authentication Hub Controller (Unified Instagram Layout)
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
import { CustomIcon } from '../../components/common/CustomIcon';
import { ApiEndpoints, ApiRuntime, setApiBaseUrl } from '../../constants/apiEndpoints';

const { width, height } = Dimensions.get('window');
const DEV_HTTP_SCHEME = 'http';
const buildDevApiBaseUrl = (host, port = 5001) => `${DEV_HTTP_SCHEME}://${host}:${port}/api/v1`;
const ENV_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';
const ENV_API_HOST = process.env.EXPO_PUBLIC_API_HOST || '';

const AUTH_COLORS = {
  primary: '#FF7F50',    
  charcoal: '#1E1E24',   
  background: '#FFFFFF', 
  surface: '#F8FAFC',    
  border: '#E2E8F0',     
  textMuted: '#64748B',  
  errorBg: '#FEF2F2',    
  errorText: '#DC2626'   
};

const CAROUSEL_IMAGES = [
  { id: '1', source: require('../../assets/images/6.png') },
  { id: '2', source: require('../../assets/images/7.png') },
  { id: '3', source: require('../../assets/images/8.png') },
  { id: '4', source: require('../../assets/images/9.png') }
];

export default function AuthHubScreen({ onAuthSuccess, onForgotPassword }) {
  const insets = useSafeAreaInsets();

  // Navigation Panel Controls
  const [activeTab, setActiveTab] = useState('SIGN_IN'); 
  const [currentStep, setCurrentStep] = useState('IDENTIFIER'); 
  
  // Instagram Style Sub-tabs inside Sign In & Registration Modes
  const [signInSubTab, setSignInSubTab] = useState('EMAIL'); // NEW: EMAIL or PHONE for Sign In
  const [registrationSubTab, setRegistrationSubTab] = useState('EMAIL');

  // Input Field Bindings
  const [identifier, setIdentifier] = useState(''); 
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');

  // UI Flow Controls
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Continuing...');
  const [errorMessage, setErrorMessage] = useState('');
  const [backendCheckInProgress, setBackendCheckInProgress] = useState(true);
  const [backendReachable, setBackendReachable] = useState(false);
  const [backendStatusMessage, setBackendStatusMessage] = useState('Checking backend connection...');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Parallax Header Graphics Animation Variables
  const [imageIndex, setImageIndex] = useState(0);
  const imageScrollX = useRef(new Animated.Value(0)).current;
  const imageListRef = useRef(null);
  const visualHeightAnim = useRef(new Animated.Value(height * 0.46)).current;

  const buildHealthCandidates = () => {
    const candidates = [];
    const addCandidate = (baseUrl) => {
      if (!baseUrl || candidates.includes(baseUrl)) return;
      candidates.push(baseUrl);
    };

    if (ENV_API_BASE_URL) {
      addCandidate(ENV_API_BASE_URL);
    }

    if (ENV_API_HOST) {
      addCandidate(buildDevApiBaseUrl(ENV_API_HOST));
    }

    addCandidate(ApiEndpoints.BASE_URL);
    addCandidate(ApiEndpoints.BASE_URL.replace(/^https:/i, 'http:'));

    if (ApiRuntime?.runtimeHost) {
      addCandidate(buildDevApiBaseUrl(ApiRuntime.runtimeHost));
    }

    if (Platform.OS === 'android') {
      addCandidate(buildDevApiBaseUrl('10.0.2.2'));
    }

    addCandidate(buildDevApiBaseUrl('localhost'));
    addCandidate(buildDevApiBaseUrl('127.0.0.1'));

    return candidates;
  };

  const verifyBackendConnection = async () => {
    setBackendCheckInProgress(true);
    setBackendStatusMessage('Checking backend connection...');

    const candidates = buildHealthCandidates();
    const attemptedUrls = [];
    let connectedHealthUrl = null;

    for (const baseUrl of candidates) {
      const apiBaseUrl = baseUrl.replace(/\/$/, '');
      const infrastructureHealthUrl = `${apiBaseUrl}/health/infrastructure`;
      const basicHealthUrl = `${apiBaseUrl}/health`;
      attemptedUrls.push(infrastructureHealthUrl);

      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 4000);

      try {
        let response = await fetch(infrastructureHealthUrl, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          signal: abortController.signal,
        });

        if (!response.ok) {
          response = await fetch(basicHealthUrl, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
            signal: abortController.signal,
          });
        }

        if (!response.ok) {
          throw new Error(`Backend health failed with status ${response.status}.`);
        }

        const payload = await response.json().catch(() => ({}));
        const services = payload?.data?.services || {};
        const mongoService = services?.mongodb;
        const supabaseService = services?.supabase;
        const cloudinaryService = services?.cloudinary;
        const mongoServiceStatus = mongoService?.state || 'unknown';

        setApiBaseUrl(baseUrl);
        connectedHealthUrl = `${ApiEndpoints.BASE_URL}/health/infrastructure`;
        setBackendReachable(true);
        const mongodbStatusCopy = mongoService?.connected
          ? `MongoDB: connected (${mongoService?.database || 'database not named'})`
          : `MongoDB: ${mongoServiceStatus}`;
        let supabaseStatusCopy = 'Supabase: not configured';
        if (supabaseService) {
          supabaseStatusCopy = supabaseService?.connected
            ? 'Supabase: connected'
            : `Supabase: ${supabaseService?.error || 'not connected'}`;
        } else if (services?.supabaseConfigured) {
          supabaseStatusCopy = 'Supabase: configured';
        }

        let cloudinaryStatusCopy = 'Cloudinary: not configured';
        if (cloudinaryService) {
          cloudinaryStatusCopy = cloudinaryService?.configured
            ? `Cloudinary: configured (${cloudinaryService?.cloudName || 'cloud'})`
            : 'Cloudinary: not configured';
        } else if (services?.cloudinaryConfigured) {
          cloudinaryStatusCopy = 'Cloudinary: configured';
        }
        setBackendStatusMessage(`Connected to backend at ${connectedHealthUrl} • ${mongodbStatusCopy} • ${supabaseStatusCopy} • ${cloudinaryStatusCopy}`);
        break;
      } catch {
        // Keep probing remaining candidates until one succeeds.
      } finally {
        clearTimeout(timeoutId);
      }
    }

    if (!connectedHealthUrl) {
      setBackendReachable(false);
      const firstAttempt = attemptedUrls[0] || `${ApiEndpoints.BASE_URL}/health`;
      setBackendStatusMessage(`Cannot reach backend at ${firstAttempt}`);
    }

    setBackendCheckInProgress(false);
  };

  const backendReadyForAuth = backendReachable && !backendCheckInProgress;

  // Responsive view adjustments when the keyboard opens
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

  useEffect(() => {
    verifyBackendConnection();
  }, []);

  const switchPanelTabsState = (targetTab, targetStep) => {
    setErrorMessage('');
    setActiveTab(targetTab);
    setCurrentStep(targetStep);
  };

  const executeSignInPipeline = async () => {
    setErrorMessage('');

    if (!backendReadyForAuth) {
      setErrorMessage(`Backend is not reachable. ${backendStatusMessage}`);
      return;
    }

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email or username to continue.');
      return;
    }

    if (currentStep === 'IDENTIFIER') {
      setCurrentStep('PASSWORD');
    } else if (currentStep === 'PASSWORD') {
      if (!password.trim()) {
        setErrorMessage('Please enter your password.');
        return;
      }
      setLoading(true);
      setLoadingText('Signing you in...');
      
      try {
        if (onAuthSuccess) {
          const result = await Promise.resolve(onAuthSuccess({ identifier, password, action: 'SIGN_IN' }));
          if (result?.success === false) throw new Error(result.error || 'Sign in failed.');
        }
      } catch (error) {
        setErrorMessage(error?.message || 'Sign in failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    }
  };

  const executeRegistrationPipeline = async () => {
    setErrorMessage('');

    if (!backendReadyForAuth) {
      setErrorMessage(`Backend is not reachable. ${backendStatusMessage}`);
      return;
    }

    const targetIdentifier = registrationSubTab === 'EMAIL' ? identifier : phone;

    if (currentStep === 'IDENTIFIER') {
      if (!fullName.trim() || !targetIdentifier.trim()) {
        setErrorMessage(`Please enter your full name and ${registrationSubTab.toLowerCase()} to continue.`);
        return;
      }
      setCurrentStep('VERIFICATION');
    } else if (currentStep === 'VERIFICATION') {
      if (!otpCode.trim() || otpCode.trim().length < 6) {
        setErrorMessage('Password must be at least 6 characters.');
        return;
      }
      setLoading(true);
      setLoadingText('Creating your account...');

      try {
        if (onAuthSuccess) {
          const result = await Promise.resolve(onAuthSuccess({ 
            fullName, 
            identifier: targetIdentifier, 
            password: otpCode, 
            type: registrationSubTab,
            action: 'CREATE_ACCOUNT' 
          }));
          if (result?.success === false) throw new Error(result.error || 'Registration failed.');
        }
      } catch (error) {
        setErrorMessage(error?.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const executeRecoveryPipeline = () => {
    setErrorMessage('');
    if (currentStep === 'RECOVERY') {
      if (!identifier.trim()) {
        setErrorMessage('Please provide an email or phone number.');
        return;
      }
      setCurrentStep('RESET_PASSWORD');
    } else if (currentStep === 'RESET_PASSWORD') {
      if (!newPassword.trim()) {
        setErrorMessage('Please enter a secure new password.');
        return;
      }
      setLoading(true);
      setLoadingText('Updating records...');
      if (onAuthSuccess) {
        onAuthSuccess({ identifier, newPassword, action: 'PASSWORD_RESET' });
      }
    }
  };

  const executeThirdPartySocialAuth = async (providerName) => {
    setErrorMessage('');

    if (!backendReadyForAuth) {
      setErrorMessage(`Backend is not reachable. ${backendStatusMessage}`);
      return;
    }

    setLoading(true);
    setLoadingText(`Connecting to ${providerName}...`);
    try {
      if (onAuthSuccess) {
        const result = await Promise.resolve(onAuthSuccess({ provider: providerName, action: 'SOCIAL_AUTH' }));
        if (result?.success === false) {
          throw new Error(result.error || `${providerName} authentication failed.`);
        }
      }
    } catch (error) {
      setErrorMessage(error?.message || `${providerName} authentication failed.`);
    } finally {
      setLoading(false);
    }
  };

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
          <View style={[styles.backendStatusCard, backendReadyForAuth ? styles.backendStatusCardSuccess : styles.backendStatusCardError]}>
            <Text style={[styles.backendStatusCardText, backendReadyForAuth ? styles.backendStatusCardTextSuccess : styles.backendStatusCardTextError]}>
              {backendStatusMessage}
            </Text>
            {!backendReadyForAuth && (
              <TouchableOpacity style={styles.backendRetryButton} onPress={verifyBackendConnection} disabled={backendCheckInProgress}>
                <Text style={styles.backendRetryButtonText}>{backendCheckInProgress ? 'Checking...' : 'Retry'}</Text>
              </TouchableOpacity>
            )}
          </View>

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

          {/* Form Context Rendering - Sign In Flows */}
          {activeTab === 'SIGN_IN' && currentStep === 'IDENTIFIER' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Welcome back</Text>
              <Text style={styles.subtextSupportText}>Ready for your next Food & Drinks experience?</Text>

              {/* NEW: Instagram-Style Selector Bar for Sign-In Option */}
              <View style={styles.instagramSubTabBar}>
                <TouchableOpacity style={[styles.instagramSubTabCell, signInSubTab === 'EMAIL' && styles.instagramSubTabCellActive]} onPress={() => setSignInSubTab('EMAIL')}>
                  <Text style={[styles.instagramSubTabText, signInSubTab === 'EMAIL' && styles.instagramSubTabTextActive]}>Email or Username</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.instagramSubTabCell, signInSubTab === 'PHONE' && styles.instagramSubTabCellActive]} onPress={() => setSignInSubTab('PHONE')}>
                  <Text style={[styles.instagramSubTabText, signInSubTab === 'PHONE' && styles.instagramSubTabTextActive]}>Phone</Text>
                </TouchableOpacity>
              </View>

              {/* Dynamic field rendering depending on the selected Sign In tab */}
              {signInSubTab === 'EMAIL' ? (
                <View style={[styles.inputGroupContainer, focusedField === 'si_id' && styles.inputGroupContainerActive]}>
                  <Text style={styles.fieldInputLabel}>Email or Username</Text>
                  <TextInput style={styles.accessibleInputField} placeholder="Registered Email or Username" placeholderTextColor={AUTH_COLORS.textMuted} value={identifier} onChangeText={setIdentifier} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('si_id')} onBlur={() => setFocusedField(null)} editable={!loading && backendReadyForAuth} />
                </View>
              ) : (
                <View style={[styles.inputGroupContainer, focusedField === 'si_phone' && styles.inputGroupContainerActive]}>
                  <Text style={styles.fieldInputLabel}>Phone Number</Text>
                  <TextInput style={styles.accessibleInputField} placeholder="Registered Phone number" placeholderTextColor={AUTH_COLORS.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" onFocus={() => setFocusedField('si_phone')} onBlur={() => setFocusedField(null)} editable={!loading && backendReadyForAuth} />
                </View>
              )}

              <TouchableOpacity style={styles.inlineBypassLinkBtn} onPress={() => { setErrorMessage(''); setCurrentStep('RECOVERY'); }} activeOpacity={0.7} disabled={loading}>
                <Text style={styles.inlineBypassLinkText}>Forgot password?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, (loading || !backendReadyForAuth) && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeSignInPipeline} disabled={loading || !backendReadyForAuth}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Continue</Text>}
              </TouchableOpacity>
            </View>
          )}

          {activeTab === 'SIGN_IN' && currentStep === 'PASSWORD' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Enter password</Text>
              <Text style={styles.subtextSupportText}>Enter your security parameters to access your profile safely.</Text>
              <View style={[styles.passwordFieldRowWrapper, focusedField === 'si_pass' && { borderColor: AUTH_COLORS.primary }]}>
                <TextInput style={styles.passwordInputFieldElement} placeholder="Enter password" placeholderTextColor={AUTH_COLORS.textMuted} secureTextEntry={!showPassword} value={password} onChangeText={setPassword} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('si_pass')} onBlur={() => setFocusedField(null)} editable={!loading && backendReadyForAuth} />
                <TouchableOpacity style={styles.passwordToggleEyeAnchor} onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                  <CustomIcon name={showPassword ? "eye-off" : "eye"} size={20} color={AUTH_COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, (loading || !backendReadyForAuth) && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeSignInPipeline} disabled={loading || !backendReadyForAuth}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Sign In</Text>}
              </TouchableOpacity>
            </View>
          )}

                    {/* Form Context Rendering - Create Account Flows */}
          {activeTab === 'CREATE_ACCOUNT' && currentStep === 'IDENTIFIER' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Create account</Text>
              <Text style={styles.subtextSupportText}>Join us for fine meals & fresh drink orders.</Text>
              
              <View style={[styles.inputGroupContainer, focusedField === 'su_name' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>Full name</Text>
                <TextInput style={styles.accessibleInputField} placeholder="Enter Your Full Name" placeholderTextColor={AUTH_COLORS.textMuted} value={fullName} onChangeText={setFullName} onFocus={() => setFocusedField('su_name')} onBlur={() => setFocusedField(null)} editable={!loading && backendReadyForAuth} />
              </View>

              {/* Instagram Style Sliding Selection Bar */}
              <View style={styles.instagramSubTabBar}>
                <TouchableOpacity style={[styles.instagramSubTabCell, registrationSubTab === 'EMAIL' && styles.instagramSubTabCellActive]} onPress={() => setRegistrationSubTab('EMAIL')}>
                  <Text style={[styles.instagramSubTabText, registrationSubTab === 'EMAIL' && styles.instagramSubTabTextActive]}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.instagramSubTabCell, registrationSubTab === 'PHONE' && styles.instagramSubTabCellActive]} onPress={() => setRegistrationSubTab('PHONE')}>
                  <Text style={[styles.instagramSubTabText, registrationSubTab === 'PHONE' && styles.instagramSubTabTextActive]}>Phone</Text>
                </TouchableOpacity>
              </View>

              {registrationSubTab === 'EMAIL' ? (
                <View style={[styles.inputGroupContainer, focusedField === 'su_id' && styles.inputGroupContainerActive]}>
                  <Text style={styles.fieldInputLabel}>Email address</Text>
                  <TextInput style={styles.accessibleInputField} placeholder="Enter Your Email" placeholderTextColor={AUTH_COLORS.textMuted} value={identifier} onChangeText={setIdentifier} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('su_id')} onBlur={() => setFocusedField(null)} editable={!loading && backendReadyForAuth} />
                </View>
              ) : (
                <View style={[styles.inputGroupContainer, focusedField === 'su_phone' && styles.inputGroupContainerActive]}>
                  <Text style={styles.fieldInputLabel}>Phone number</Text>
                  <TextInput style={styles.accessibleInputField} placeholder="Phone number" placeholderTextColor={AUTH_COLORS.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" onFocus={() => setFocusedField('su_phone')} onBlur={() => setFocusedField(null)} editable={!loading && backendReadyForAuth} />
                </View>
              )}

              <TouchableOpacity style={[styles.primaryActionButtonFrame, (loading || !backendReadyForAuth) && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeRegistrationPipeline} disabled={loading || !backendReadyForAuth}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Continue</Text>}
              </TouchableOpacity>
            </View>
          )}

          {currentStep === 'VERIFICATION' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Secure your account</Text>
              <Text style={styles.subtextSupportText}>Create a password using 6 mixed characters or more.</Text>
              <View style={[styles.inputGroupContainer, focusedField === 'otp' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>Password</Text>
                <TextInput style={styles.accessibleInputField} placeholder="Create password" placeholderTextColor={AUTH_COLORS.textMuted} secureTextEntry value={otpCode} onChangeText={setOtpCode} onFocus={() => setFocusedField('otp')} onBlur={() => setFocusedField(null)} editable={!loading && backendReadyForAuth} />
              </View>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, (loading || !backendReadyForAuth) && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeRegistrationPipeline} disabled={loading || !backendReadyForAuth}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Create Account</Text>}
              </TouchableOpacity>
            </View>
          )}

          {currentStep === 'RECOVERY' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Find my account</Text>
              <Text style={styles.subtextSupportText}>Enter your account details to recover your account safely.</Text>
              <View style={[styles.inputGroupContainer, focusedField === 'rec' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>Email or phone number</Text>
                <TextInput style={styles.accessibleInputField} placeholder="Enter your email or phone" placeholderTextColor={AUTH_COLORS.textMuted} value={identifier} onChangeText={setIdentifier} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('rec')} onBlur={() => setFocusedField(null)} editable={!loading && backendReadyForAuth} />
              </View>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, (loading || !backendReadyForAuth) && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeRecoveryPipeline} disabled={loading || !backendReadyForAuth}>
                {loading ? <View style={styles.btnLoadingRow}><ActivityIndicator color="#FFFFFF" size="small" /><Text style={styles.btnLoadingRowText}>{loadingText}</Text></View> : <Text style={styles.primaryActionText}>Continue</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.inlineBypassLinkBtn} onPress={() => setCurrentStep('IDENTIFIER')} activeOpacity={0.7} disabled={loading}>
                <Text style={[styles.inlineBypassLinkText, { color: AUTH_COLORS.textMuted, textDecorationLine: 'underline' }]}>Return to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}

          {currentStep === 'RESET_PASSWORD' && (
            <View style={styles.formContainer}>
              <Text style={styles.headingTitleText}>Reset password</Text>
              <Text style={styles.subtextSupportText}>Set up your new account password details below.</Text>
              <View style={[styles.inputGroupContainer, focusedField === 'new_pass' && styles.inputGroupContainerActive]}>
                <Text style={styles.fieldInputLabel}>New Password</Text>
                <TextInput style={styles.accessibleInputField} placeholder="Enter your new password" placeholderTextColor={AUTH_COLORS.textMuted} secureTextEntry value={newPassword} onChangeText={setNewPassword} autoCapitalize="none" autoCorrect={false} onFocus={() => setFocusedField('new_pass')} onBlur={() => setFocusedField(null)} editable={!loading && backendReadyForAuth} />
              </View>
              <TouchableOpacity style={[styles.primaryActionButtonFrame, (loading || !backendReadyForAuth) && { opacity: 0.6 }]} activeOpacity={0.85} onPress={executeRecoveryPipeline} disabled={loading || !backendReadyForAuth}>
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
            <TouchableOpacity style={[styles.socialProviderButtonFrame, (!backendReadyForAuth || loading) && { opacity: 0.6 }]} activeOpacity={0.8} onPress={() => executeThirdPartySocialAuth('Google')} disabled={loading || !backendReadyForAuth}>
              <CustomIcon name="google" size={18} color="#EA4335" style={styles.socialIconSpacingMargin} />
              <Text style={styles.socialProviderButtonLabel}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialProviderButtonFrame, (!backendReadyForAuth || loading) && { opacity: 0.6 }]} activeOpacity={0.8} onPress={() => executeThirdPartySocialAuth('Apple')} disabled={loading || !backendReadyForAuth}>
              <CustomIcon name="apple" size={18} color="#111210" style={styles.socialIconSpacingMargin} />
              <Text style={styles.socialProviderButtonLabel}>Continue with Apple</Text>
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
 * Part 4A: Core View Elements Style Sheets Mapping Matrix
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
  lowerFormWorkspace: {
    flex: 1,
    backgroundColor: AUTH_COLORS.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
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
  instagramSubTabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    width: '100%',
  },
  instagramSubTabCell: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  instagramSubTabCellActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  instagramSubTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: AUTH_COLORS.textMuted,
  },
  instagramSubTabTextActive: {
    color: AUTH_COLORS.charcoal,
    fontWeight: '700',
  },
  backendStatusCard: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  backendStatusCardSuccess: {
    backgroundColor: '#ECFDF3',
    borderColor: '#86EFAC',
  },
  backendStatusCardError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  backendStatusCardText: {
    fontSize: 12,
    flex: 1,
  },
  backendStatusCardTextSuccess: {
    color: '#166534',
  },
  backendStatusCardTextError: {
    color: '#991B1B',
  },
  backendRetryButton: {
    backgroundColor: AUTH_COLORS.charcoal,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  backendRetryButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  errorDisplayCard: {
    backgroundColor: AUTH_COLORS.errorBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 54, 0.1)',
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
