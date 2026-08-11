/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Core App Architecture Settings & Feature Toggles
 * src/constants/config.js
 */

import { Platform } from 'react-native';

export const AppConfig = {
  appName: 'Buza App',
  companyLegalName: 'Buza Technologies Ltd.',
  supportEmail: 'concierge@buzaapp.com',
  clientTimeoutMs: 15000,
  defaultCurrency: 'TZS',
  defaultLocale: 'sw-TZ',
};

export const StorageKeys = {
  USER_TOKEN: '@buza_secure_auth_token',
  USER_PROFILE: '@buza_user_profile_cache',
  ACTIVE_CART: '@buza_active_shopping_cart',
  THEME_PREFERENCE: '@buza_system_theme_mode',
  RECENT_SEARCHES: '@buza_historical_queries',
};

export const CountryCodes = [
  { code: 'AE', dialCode: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'TZ', dialCode: '+255', name: 'Tanzania', flag: '🇹🇿' }
];

export const FeatureFlags = {
  ENABLE_LOTTIE_ANIMATIONS: true,
  ENABLE_REAL_TIME_DRIVER_MAP_STREAMING: false, // Set to true once map sockets are hot
  ALLOW_APPLE_PAY: Platform.OS === 'ios',
  ALLOW_GOOGLE_PAY: Platform.OS === 'android',
  MAINTENANCE_MODE: false,
};

export const ValidationRegex = {
  email: null,
  phoneNumber: /^\+?[1-9]\d{1,14}$/, // E.164 compliance structure
  otpCode: /^\d{4,6}$/,
};
