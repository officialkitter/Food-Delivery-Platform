/**
 * Buza Food Delivery Mobile Application
 * Core Authentication Stack Navigation Controller
 * src/screens/auth/AuthNavigator.js
 */

import React, { useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { authService } from '../../services/authService';
import { useGoogleAuthService } from '../../services/googleAuthService';
import { registerForPushNotificationsAsync, registerPushTokenForCurrentUserAsync } from '../../services/usePushNotifications';

// Import all 12 modules located within your local filesystem directory
import SplashScreen from '../../screens/auth/splash';
import OnboardingScreen from '../../screens/auth/onboard';
import GatewayScreen from '../../screens/auth/gate';
import AuthHubScreen from '../../screens/auth/auth';
import PassForgotScreen from '../../screens/auth/passforgot';
import OTPVerifyScreen from '../../screens/auth/verify';
import PasswordCreateScreen from '../../screens/auth/passcreate';
import WelcomeSuccessScreen from '../../screens/auth/welcome';
import BiometricSetupScreen from '../../screens/auth/biometricsetup';
import LocationSetupScreen from '../../screens/auth/locationsetup';
import ComingSoonScreen from '../../screens/auth/comingsoon';
import { PremiumMotionBackdrop } from '../../components/common/PremiumMotionBackdrop';

export default function AuthNavigator({ onAppAuthenticationComplete }) {
  // Centralized state tracks which active screen name layer is visible
  const [currentScreen, setCurrentScreen] = useState('SPLASH');

  // Shared payload storage context to hold registration metadata across step forms
  const authPayloadRef = useRef({});
  const { signInWithGoogle } = useGoogleAuthService();

  const setAuthPayload = (valueOrUpdater) => {
    authPayloadRef.current = typeof valueOrUpdater === 'function'
      ? valueOrUpdater(authPayloadRef.current)
      : valueOrUpdater;
  };

  const handleScreenChange = (screenName) => {
    setCurrentScreen(screenName);
  };

  const finalizeAuthentication = () => {
    if (onAppAuthenticationComplete) {
      onAppAuthenticationComplete();
    }
  };

  const showPremiumMotionBackdrop = currentScreen !== 'SPLASH' && currentScreen !== 'GATEWAY';

  return (
    <View style={styles.container}>
      {currentScreen === 'SPLASH' && (
        <SplashScreen onInitializationComplete={() => handleScreenChange('ONBOARDING')} />
      )}

      {currentScreen === 'ONBOARDING' && (
        <OnboardingScreen onExitOnboarding={() => handleScreenChange('GATEWAY')} />
      )}

      {currentScreen === 'GATEWAY' && (
        <GatewayScreen 
          onNavigateToAuth={() => handleScreenChange('AUTH_HUB')}
          onNavigateToGuest={finalizeAuthentication}
          onNavigateToSupport={() => handleScreenChange('COMING_SOON')}
        />
      )}

      {currentScreen === 'AUTH_HUB' && (
        <AuthHubScreen 
          onAuthSuccess={async (payload) => {
            try {
              setAuthPayload(payload);

              if (payload.action === 'SIGN_IN') {
                const response = await authService.loginWithCredentials({
                  identifier: payload.identifier,
                  password: payload.password,
                });
                const authenticatedUserId = response?.data?.user?.id;
                if (authenticatedUserId) {
                  await registerForPushNotificationsAsync(authenticatedUserId).catch((pushError) => {
                    console.warn('[auth] Push token sync failed after sign in:', pushError?.message || pushError);
                  });
                }
                handleScreenChange('BIOMETRIC_SETUP');
                return { success: true };
              }

              if (payload.action === 'CREATE_ACCOUNT') {
                const response = await authService.registerWithCredentials({
                  fullName: payload.fullName,
                  identifier: payload.identifier,
                  password: payload.password,
                });
                const authenticatedUserId = response?.data?.user?.id;
                if (authenticatedUserId) {
                  await registerForPushNotificationsAsync(authenticatedUserId).catch((pushError) => {
                    console.warn('[auth] Push token sync failed after registration:', pushError?.message || pushError);
                  });
                }
                handleScreenChange('WELCOME_SUCCESS');
                return { success: true };
              }

              if (payload.action === 'SOCIAL_AUTH') {
                const provider = String(payload.provider || '').toLowerCase();

                if (provider === 'google') {
                  await signInWithGoogle();
                  await registerPushTokenForCurrentUserAsync().catch((pushError) => {
                    console.warn('[auth] Push token sync failed after Google OAuth:', pushError?.message || pushError);
                  });
                  handleScreenChange('BIOMETRIC_SETUP');
                  return { success: true };
                }

                return { success: false, error: `${payload.provider || 'This'} social authentication is not configured yet.` };
              }

              return { success: false, error: 'Unsupported authentication action.' };
            } catch (error) {
              return { success: false, error: error?.message || 'Authentication request failed.' };
            }
          }}
          onForgotPassword={() => handleScreenChange('FORGOT_PASSWORD')}
        />
      )}

      {currentScreen === 'FORGOT_PASSWORD' && (
        <PassForgotScreen 
          onRecoveryInitiated={(payload) => {
            setAuthPayload(prev => ({ ...prev, ...payload }));
            handleScreenChange('OTP_VERIFY');
          }}
          onReturnToLogin={() => handleScreenChange('AUTH_HUB')}
        />
      )}

      {currentScreen === 'OTP_VERIFY' && (
        <OTPVerifyScreen 
          onVerificationSuccess={() => handleScreenChange('PASSWORD_CREATE')}
          onReturnBack={() => handleScreenChange('FORGOT_PASSWORD')}
        />
      )}

      {currentScreen === 'PASSWORD_CREATE' && (
        <PasswordCreateScreen 
          onPasswordConfigured={() => handleScreenChange('AUTH_HUB')}
        />
      )}

      {currentScreen === 'WELCOME_SUCCESS' && (
        <WelcomeSuccessScreen onExploreApp={() => handleScreenChange('BIOMETRIC_SETUP')} />
      )}

      {currentScreen === 'BIOMETRIC_SETUP' && (
        <BiometricSetupScreen 
          onConfigurationComplete={() => handleScreenChange('LOCATION_SETUP')}
          onBypassPrompt={() => handleScreenChange('LOCATION_SETUP')}
        />
      )}

      {currentScreen === 'LOCATION_SETUP' && (
        <LocationSetupScreen 
          onLocationConfigured={finalizeAuthentication}
          onManualAddressSelect={finalizeAuthentication}
        />
      )}

      {currentScreen === 'COMING_SOON' && (
        <ComingSoonScreen onReturnBack={() => handleScreenChange('GATEWAY')} />
      )}

      {showPremiumMotionBackdrop && (
        <View style={styles.motionBackdropLayer} pointerEvents="none">
          <PremiumMotionBackdrop />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  motionBackdropLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 20,
  },
});
