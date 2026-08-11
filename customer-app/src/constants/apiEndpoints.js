/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Centralized API Communication Endpoint Schemas
 * src/constants/apiEndpoints.js
 */

import { NativeModules, Platform } from 'react-native';

const API_VERSION = '/api/v1';
const DEV_HTTP_SCHEME = 'http';
const ANDROID_EMULATOR_HOST = '10.0.2.2';
const ANDROID_EMULATOR_HOST_ALIAS = '10.2.2';
const buildDevBaseHost = (host, port = 5001) => `${DEV_HTTP_SCHEME}://${host}:${port}`;
const DEFAULT_BASE_HOST = Platform.OS === 'android' ? buildDevBaseHost(ANDROID_EMULATOR_HOST) : buildDevBaseHost('localhost');
const ENV_API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || '';
const ENV_API_HOST = process.env.EXPO_PUBLIC_API_HOST || '';

const normalizeAndroidEmulatorHost = (value) => {
  const compact = String(value || '').trim();
  if (!compact) return compact;
  if (compact === ANDROID_EMULATOR_HOST_ALIAS) return ANDROID_EMULATOR_HOST;
  return compact;
};

const isPrivateOrLocalHost = (host) => {
  if (!host) return false;
  const normalized = String(host).toLowerCase();
  if (normalized === 'localhost' || normalized === '127.0.0.1' || normalized === '::1') return true;

  if (normalized.startsWith('10.')) return true;
  if (normalized.startsWith('192.168.')) return true;

  if (normalized.startsWith('172.')) {
    const octets = normalized.split('.');
    const secondOctet = Number.parseInt(octets[1] || '', 10);
    if (!Number.isNaN(secondOctet) && secondOctet >= 16 && secondOctet <= 31) {
      return true;
    }
  }

  return false;
};

const detectRuntimeDevHost = () => {
  try {
    const scriptURL = NativeModules?.SourceCode?.scriptURL;
    if (!scriptURL) return null;

    const hostMatch = scriptURL.match(/^[a-z]+:\/\/([^/:]+)/i);
    if (!hostMatch?.[1]) return null;

    return hostMatch[1];
  } catch {
    return null;
  }
};

const sanitizeHost = (value) => {
  if (!value) return null;

  const compact = String(value).trim();
  if (!compact) return null;

  const noScheme = compact.replace(/^[a-z]+:\/\//i, '');
  const hostOnly = normalizeAndroidEmulatorHost(noScheme.split('/')[0].split(':')[0].trim());
  if (!hostOnly) return null;

  return hostOnly;
};

const runtimeHost = detectRuntimeDevHost();
const envHost = sanitizeHost(ENV_API_HOST);
let runtimeBaseHost = DEFAULT_BASE_HOST;
if (envHost) {
  runtimeBaseHost = buildDevBaseHost(envHost);
}
if (isPrivateOrLocalHost(runtimeHost)) {
  runtimeBaseHost = buildDevBaseHost(runtimeHost);
}
const BASE_HOST = runtimeBaseHost.replace(/\/$/, '');

const isLikelyTunnelHost = Boolean(runtimeHost && !isPrivateOrLocalHost(runtimeHost));

const forceHttpForLocalHost = (base) => {
  if (!base?.startsWith('https://')) return base;

  const hostPart = base.replace(/^https:\/\//i, '').split('/')[0] || '';
  const hostOnly = hostPart.split(':')[0] || '';
  if (!isPrivateOrLocalHost(hostOnly)) return base;

  return base.replace(/^https:/i, `${DEV_HTTP_SCHEME}:`);
};

const repairMalformedScheme = (candidate) => {
  const value = String(candidate || '').trim();
  if (!value) return value;

  if (value.startsWith('host://')) {
    return `${DEV_HTTP_SCHEME}://${value.slice('host://'.length)}`;
  }

  if (/^[a-z]+:\/\//i.test(value)) {
    return value.replace(ANDROID_EMULATOR_HOST_ALIAS, ANDROID_EMULATOR_HOST);
  }

  // Repair malformed values like "https:10.0.2.2:5001/api/va" -> "https://10.0.2.2:5001/api/va"
  if (/^[a-z]+:[^/]/i.test(value)) {
    const protocolMatch = /^([a-z]+):(.*)$/i.exec(value);
    if (protocolMatch?.[1]) {
      const normalizedProtocol = protocolMatch[1].toLowerCase() === 'host' ? DEV_HTTP_SCHEME : protocolMatch[1];
      return `${normalizedProtocol}://${String(protocolMatch[2] || '').replace(ANDROID_EMULATOR_HOST_ALIAS, ANDROID_EMULATOR_HOST)}`;
    }
  }

  return value.replace(ANDROID_EMULATOR_HOST_ALIAS, ANDROID_EMULATOR_HOST);
};

const normalizeApiVersionPath = (candidate) => {
  const value = String(candidate || '').trim();
  if (!value) return value;

  // Normalize common typos such as /api/va or /api/v
  const patched = value.replace(/\/api\/(va|v)(?=\/|$)/i, API_VERSION);
  return patched;
};

const normalizeBaseUrl = (base) => {
  const repairedBase = repairMalformedScheme(base);
  const safeBase = forceHttpForLocalHost(repairedBase);

  const normalizedVersionBase = normalizeApiVersionPath(safeBase);

  if (normalizedVersionBase.endsWith(API_VERSION)) {
    return normalizedVersionBase;
  }
  return `${normalizedVersionBase}${API_VERSION}`;
};

const normalizeRuntimeApiBaseUrl = (candidate) => {
  if (!candidate) return null;

  const compact = String(candidate).trim().replace(/\/$/, '');
  const withoutHealthSuffix = compact.replace(/\/health$/i, '');
  return normalizeBaseUrl(withoutHealthSuffix);
};

const envBaseUrl = normalizeRuntimeApiBaseUrl(ENV_API_BASE_URL);

export const ApiEndpoints = {
  // Runtime-wired to the machine hosting Metro and customer-backend.
  BASE_URL: envBaseUrl || normalizeBaseUrl(BASE_HOST),

  config: {
    googleAuth: '/config/google-auth',
  },
  
  auth: {
    login: '/auth/login',
    google: '/auth/google',
    firebaseVerifyIdToken: '/auth/firebase/verify-id-token',
    verifyOtp: '/auth/verify-otp',
    register: '/auth/register',
    refreshToken: '/auth/refresh-token',
  },
  
  vendor: {
    homeFeed: '/vendors/home-feed',
    browse: '/vendors/search',
    categories: '/vendors/categories',
    details: (id) => `/vendors/${id}`,
    reviews: (id) => `/vendors/${id}/reviews`,
  },

  admin: {
    seedMarketplace: '/admin/seed-marketplace',
  },
  
  cart: {
    checkout: '/cart/checkout',
    applyCoupon: '/cart/coupons/validate',
    activeBasket: '/cart/current',
  },

  payments: {
    authorize: '/payments/authorize',
  },

  notifications: {
    firebase: {
      registerToken: '/notifications/firebase/register-token',
      push: '/notifications/firebase/push',
      pushToUser: '/notifications/firebase/push-to-user',
    },
  },
  
  tracking: {
    liveRoute: (orderId) => `/orders/${orderId}/stream-coordinates`,
    driverDetails: (driverId) => `/drivers/${driverId}/status`,
  },

  maps: {
    reverseGeocode: '/maps/reverse-geocode',
  },

  profile: {
    updateAddress: '/user/addresses',
    savedPaymentMethods: '/user/payments',
    rewardPoints: '/user/rewards',
  }
};

export const ApiRuntime = {
  runtimeHost,
  envHost,
  envBaseUrl,
  isLikelyTunnelHost,
};

export const setApiBaseUrl = (candidate) => {
  const normalized = normalizeRuntimeApiBaseUrl(candidate);
  if (!normalized) return ApiEndpoints.BASE_URL;

  ApiEndpoints.BASE_URL = normalized;
  return ApiEndpoints.BASE_URL;
};
