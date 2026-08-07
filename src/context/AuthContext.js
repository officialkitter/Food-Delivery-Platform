/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core Session Identity Management Provider
 * src/context/AuthContext.js
 */

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Checks device flash memory for pre-existing validation states on boot
  useEffect(() => {
    const initializeSessionState = async () => {
      const storedToken = await AsyncStorage.getItem(StorageKeys.USER_TOKEN).catch(() => null);
      const storedProfile = await AsyncStorage.getItem(StorageKeys.USER_PROFILE).catch(() => null);

      if (storedToken && storedProfile) {
        setToken(storedToken);
        setUser(JSON.parse(storedProfile));
      } else {
        setError('Session token reconstruction layer failure.');
      }

      setIsLoading(false);
    };
    initializeSessionState();
  }, []);

  // Action: Trigger secure phone authorization sequence
  const requestOtpChallenge = useCallback(async (phoneNumber) => {
    setIsLoading(true);
    setError(null);
    // Future Integration Point:
    // await axios.post(`${ApiEndpoints.BASE_URL}${ApiEndpoints.auth.login}`, { phoneNumber });
    setIsLoading(false);
    return true;
  }, []);

  // Action: Verify explicit pin sequence input matrices
  const resolveOtpVerification = useCallback(async (phoneNumber, otpCode) => {
    setIsLoading(true);
    setError(null);

    // Mock Response payload mapping out eventual secure server schemas
    const mockPayload = {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.buza_session_token_671192',
      profile: { id: 'usr_812', name: 'Premium Client', phone: phoneNumber, tier: 'VIP' }
    };

    await AsyncStorage.setItem(StorageKeys.USER_TOKEN, mockPayload.token);
    await AsyncStorage.setItem(StorageKeys.USER_PROFILE, JSON.stringify(mockPayload.profile));

    setToken(mockPayload.token);
    setUser(mockPayload.profile);
    setIsLoading(false);
    return true;
  }, []);

  // Action: Wipe credentials on logout
  const terminateSession = useCallback(async () => {
    setIsLoading(true);
    await AsyncStorage.multiRemove([StorageKeys.USER_TOKEN, StorageKeys.USER_PROFILE]);
    setToken(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    requestOtpChallenge,
    resolveOtpVerification,
    terminateSession
  }), [user, token, isLoading, error, requestOtpChallenge, resolveOtpVerification, terminateSession]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth requires matching AuthProvider packaging.');
  return context;
};
