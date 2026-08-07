/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Centralized API Communication Endpoint Schemas
 * src/constants/apiEndpoints.js
 */

import { Platform } from 'react-native';

const API_VERSION = '/api/v1';
const DEFAULT_BASE_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:5001' : 'http://localhost:5001';
const ENV_BASE_HOST = process?.env?.EXPO_PUBLIC_API_BASE_URL;
const BASE_HOST = (ENV_BASE_HOST || DEFAULT_BASE_HOST).replace(/\/$/, '');

const normalizeBaseUrl = (base) => {
  if (base.endsWith(API_VERSION)) {
    return base;
  }
  return `${base}${API_VERSION}`;
};

export const ApiEndpoints = {
  // Optionally set EXPO_PUBLIC_API_BASE_URL (e.g. http://192.168.1.20:5001)
  BASE_URL: normalizeBaseUrl(BASE_HOST),
  
  auth: {
    login: '/auth/login',
    verifyOtp: '/auth/verify-otp',
    register: '/auth/register',
    refreshToken: '/auth/refresh-token',
  },
  
  vendor: {
    browse: '/vendors/search',
    categories: '/vendors/categories',
    details: (id) => `/vendors/${id}`,
    reviews: (id) => `/vendors/${id}/reviews`,
  },
  
  cart: {
    checkout: '/cart/checkout',
    applyCoupon: '/cart/coupons/validate',
    activeBasket: '/cart/current',
  },
  
  tracking: {
    liveRoute: (orderId) => `/orders/${orderId}/stream-coordinates`,
    driverDetails: (driverId) => `/drivers/${driverId}/status`,
  },

  profile: {
    updateAddress: '/user/addresses',
    savedPaymentMethods: '/user/payments',
    rewardPoints: '/user/rewards',
  }
};
