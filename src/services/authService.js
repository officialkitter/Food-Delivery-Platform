/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * User Identity and Session Authorization Infrastructure Service
 * src/services/authService.js
 */

import { apiclient } from './apiClient';
import { ApiEndpoints } from '../constants/apiEndpoints';

export const authService = {
  /**
   * Transmits an onboard request to dispatch a secure multi-factor SMS code
   */
  async requestOtpChallenge(customerPhoneNumber) {
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 800)); // Latency Simulation
      return { success: true, message: 'Mock challenge code 1234 dispatched to target phone.' };
    }
    return await apiclient.post(ApiEndpoints.auth.login, { phoneNumber: customerPhoneNumber });
  },

  /**
   * Verifies pin matrix characters to generate user profiles and session tokens
   */
  async verifyOtpToken(customerPhoneNumber, otpCodeValue) {
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (otpCodeValue === '1234' || otpCodeValue === '123456') {
        return {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.buza_mock_jwt_token_2026',
          profile: { id: 'usr_812', fullName: 'Gourmet Enthusiast', phone: customerPhoneNumber, status: 'VIP' }
        };
      }
      const error = new Error('The confirmation code provided is incorrect or expired.');
      error.status = 400;
      throw error;
    }
    return await apiclient.post(ApiEndpoints.auth.verifyOtp, { phoneNumber: customerPhoneNumber, code: otpCodeValue });
  },

  /**
   * Requests secondary refreshing verification hashes across passive api loops
   */
  async refreshActiveSession(expiredTokenString) {
    return await apiclient.post(ApiEndpoints.auth.refreshToken, { token: expiredTokenString });
  }
};
