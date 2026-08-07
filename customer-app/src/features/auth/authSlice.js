/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Feature State Engine: Authentication Slice
 * src/features/auth/authSlice.js
 */

import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../../constants/config';

export const useAuthSlice = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Synchronize local states with underlying local storage caches on startup
  const bootstrapAsync = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem(StorageKeys.USER_TOKEN);
      const storedProfile = await AsyncStorage.getItem(StorageKeys.USER_PROFILE);

      if (storedToken && storedProfile) {
        setToken(storedToken);
        setUser(JSON.parse(storedProfile));
      }
    } catch (err) {
      if (err) {
        console.warn('[authSlice] Session bootstrap failed.', err);
      }
      setError('Failed to reconstruct secure authentication session states.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // API Trigger: Initiate an onboarding cryptographic SMS challenge
  const requestOtpChallenge = useCallback(async (phoneNumber) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate real-world carrier propagation delays
      await new Promise(resolve => setTimeout(resolve, 1000));
      return true;
    } catch (err) {
      setError(err.message || 'OTP transaction delivery channel failure.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // API Trigger: Validate temporary client verification tokens
  const resolveOtpVerification = useCallback(async (phoneNumber, otpCode) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const mockPayload = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.buza_session_token_671192',
        profile: { id: 'usr_812', name: 'Premium Client', phone: phoneNumber, tier: 'VIP' }
      };

      await AsyncStorage.setItem(StorageKeys.USER_TOKEN, mockPayload.token);
      await AsyncStorage.setItem(StorageKeys.USER_PROFILE, JSON.stringify(mockPayload.profile));

      setToken(mockPayload.token);
      setUser(mockPayload.profile);
      return true;
    } catch (err) {
      setError(err?.message || 'The security confirmation code provided is incorrect.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Action: Flush state metrics and clear local caches on user logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.multiRemove([StorageKeys.USER_TOKEN, StorageKeys.USER_PROFILE]);
      setToken(null);
      setUser(null);
    } catch (err) {
      setError(err?.message || 'Cache clean suppression failure.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    bootstrapAsync,
    requestOtpChallenge,
    resolveOtpVerification,
    logout
  };
};
