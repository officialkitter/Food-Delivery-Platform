/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * User Identity and Session Authorization Infrastructure Service
 * src/services/authService.js
 */

import { apiclient } from './apiClient';
import { ApiEndpoints } from '../constants/apiEndpoints';
import { localStorage } from './localStorage';
import { StorageKeys } from '../constants/config';

const buildIdentifierPayload = (identifier) => ({ identifier: String(identifier || '').trim() });

export const authService = {
  async registerWithCredentials({ fullName, identifier, password }) {
    const response = await apiclient.post(ApiEndpoints.auth.register, {
      fullName: String(fullName || '').trim(),
      ...buildIdentifierPayload(identifier),
      password,
    });

    const accessToken = response?.data?.accessToken;
    const profile = response?.data?.user;

    if (accessToken) {
      await localStorage.setSecureItem(StorageKeys.USER_TOKEN, accessToken);
    }
    if (profile) {
      await localStorage.setItem(StorageKeys.USER_PROFILE, profile);
    }

    return response;
  },

  async loginWithCredentials({ identifier, password }) {
    const response = await apiclient.post(ApiEndpoints.auth.login, {
      ...buildIdentifierPayload(identifier),
      password,
    });

    const accessToken = response?.data?.accessToken;
    const profile = response?.data?.user;

    if (accessToken) {
      await localStorage.setSecureItem(StorageKeys.USER_TOKEN, accessToken);
    }
    if (profile) {
      await localStorage.setItem(StorageKeys.USER_PROFILE, profile);
    }

    return response;
  },

  /**
   * Transmits an onboard request to dispatch a secure multi-factor SMS code
   */
  async requestOtpChallenge(customerPhoneNumber) {
    return await apiclient.post(ApiEndpoints.auth.login, { phoneNumber: customerPhoneNumber });
  },

  /**
   * Verifies pin matrix characters to generate user profiles and session tokens
   */
  async verifyOtpToken(customerPhoneNumber, otpCodeValue) {
    return await apiclient.post(ApiEndpoints.auth.verifyOtp, { phoneNumber: customerPhoneNumber, code: otpCodeValue });
  },

  /**
   * Requests secondary refreshing verification hashes across passive api loops
   */
  async refreshActiveSession(expiredTokenString) {
    return await apiclient.post(ApiEndpoints.auth.refreshToken, { token: expiredTokenString });
  }
};
