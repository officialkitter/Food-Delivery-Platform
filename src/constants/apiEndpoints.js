/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Centralized API Communication Endpoint Schemas
 * src/constants/apiEndpoints.js
 */

const API_VERSION = '/api/v1';

export const ApiEndpoints = {
  // Update this to your local machine IP or production staging server during live testing
  BASE_URL: 'https://buzaapp.com' + API_VERSION,
  
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
