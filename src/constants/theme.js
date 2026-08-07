/**
 * Buza Premium Food & Drinks Delivery Mobile Application
 * Centralized Application Constants Matrix (Architecture & Design Tokens)
 * Dark-Mode and Production Ready. Compliant with Apple HIG & Material Design 3.
 */

import { Platform } from 'react-native';

// ==========================================
// 1. THEME & COLOR PALETTE TOKENS
// ==========================================
export const Colors = {
  light: {
    primary: '#FF6B57',          // Premium Salmon Orange
    secondary: '#4CD964',        // Fresh Green
    accent: '#00A896',           // Deep Turquoise
    background: '#FAFAFA',       // Luxurious off-white canvas
    surface: '#FFFFFF',          // Clean pure white surface
    text: '#1A1A1A',              // Rich charcoal text
    textSecondary: '#757575',    // Mid-grey muted textual sub-layers
    border: '#EAEAEA',           // Standard crisp alignment lines
    error: '#FF3B30',            // Semantic destructive red
    warning: '#FFCC00',          // Alert warning amber
    success: '#34C759',          // Operational active confirmation green
    overlay: 'rgba(0, 0, 0, 0.4)',
    cardShadow: '#1A1A1A',
  },
  dark: {
    primary: '#FF7D6B',          // Shifted Salmon Orange for OLED high contrast
    secondary: '#5CE674',        // Electric crisp green
    accent: '#00C2AE',           // High luminance turquoise
    background: '#0F0F10',       // Deep rich liquid dark background
    surface: '#1C1C1E',          // Apple HIG dark system surface tile
    text: '#FFFFFF',              // Pure crisp white text
    textSecondary: '#A1A1A1',    // Muted low-importance dark text
    border: '#2C2C2E',           // Subtle structural grid boundaries
    error: '#FF453A',            // High visibility dark error red
    warning: '#FFD60A',          // Vivid warning amber
    success: '#30D158',          // Vivid execution green
    overlay: 'rgba(0, 0, 0, 0.75)',
    cardShadow: '#000000',
  }
};

// ==========================================
// 2. TYPOGRAPHY: FONTS & SIZES
// ==========================================
export const Fonts = {
  // Cross-platform font-family Fallbacks matching Apple & Android premium archetypes
  primary: Platform.select({ ios: 'SF Pro Display', android: 'Roboto' }),
  secondary: Platform.select({ ios: 'SF Pro Text', android: 'Noto Sans' }),
  weights: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '900',
  }
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,    // Premium core body baseline
  lg: 17,    // Primary callouts and subheadings
  xl: 20,    // Segment section title highlights
  xxl: 26,   // Massive structural hero metrics (e.g. ETA timers, pricing headers)
  display: 34,
};

// ==========================================
// 3. SPACING & LAYOUT GEOMETRY
// ==========================================
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,    // Grid system layout spacing base anchoring
  lg: 24,    // Spacious structural gaps
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,     // Micro elements like tags/badges
  md: 16,    // Core Product, Vendor, Cart item rounded cards
  lg: 24,    // Top-tier floating sheets, checkout modules, bottom panels
  full: 9999, // Dynamic circular nodes, profile avatars, action buttons
};

// ==========================================
// 4. ELEVATIONS & SHADOW CONTEXTS
// ==========================================
export const Shadows = {
  light: {
    shadowColor: Colors.light.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  dark: {
    shadowColor: Colors.dark.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 2,
  }
};

// ==========================================
// 5. ANIMATIONS & MICRO-INTERACTIONS
// ==========================================
export const Animations = {
  scale: {
    pressed: 0.96,     // Clean UI scaling feedback coefficient
    standard: 1.0,
  },
  duration: {
    snappy: 100,
    smooth: 250,       // Standard modal transitions/slide ups
    lazy: 450,
  }
};

// ==========================================
// 6. STATIC ASSET URI MANIFEST (PLACEHOLDERS)
// ==========================================
export const Images = {
  placeholders: {
    vendorHero: 'https://unsplash.com',
    productFood: 'https://unsplash.com',
    avatarDefault: 'https://unsplash.com',
  },
  brand: {
    logoLight: require('../assets/images/logo-light.png'), 
    logoDark: require('../assets/images/logo-dark.png'),
  }
};

export const LottieAssets = {
  loadingCart: require('../assets/lottie/cart-loading.json'),
  orderSuccess: require('../assets/lottie/success-burst.json'),
  deliveryRider: require('../assets/lottie/rider-tracking.json'),
  networkError: require('../assets/lottie/error-state.json'),
};

// ==========================================
// 7. REGIONAL, LOCALE, AND FINANCIAL TOKENS
// ==========================================
export const CountryCodes = [
  { code: 'AE', dialCode: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: 'SA', dialCode: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'TZ', dialCode: '+255', name: 'Tanzania', flag: '🇹🇿' }
];

export const Currencies = {
  primary: { code: 'USD', symbol: '$', decimalPlaces: 2 },
  secondary: { code: 'AED', symbol: 'AED ', decimalPlaces: 2 }
};

// ==========================================
// 8. LIFECYCLE & STATE STATE MACHINE TRACKERS
// ==========================================
export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const DeliveryStatus = {
  ASSIGNING_DRIVER: 'ASSIGNING_DRIVER',
  AT_VENDOR: 'AT_VENDOR',
  COLLECTED: 'COLLECTED',
  NEARBY: 'NEARBY',
  ARRIVED: 'ARRIVED',
};

// ==========================================
// 9. API ENDPOINTS ENGINE (MVP LAYER)
// ==========================================
const API_VERSION = '/api/v1';
export const ApiEndpoints = {
  BASE_URL: 'https://buzaapp.com' + API_VERSION,
  auth: {
    login: '/auth/login',
    verifyOtp: '/auth/verify-otp',
    register: '/auth/register',
  },
  vendor: {
    browse: '/vendors/search',
    details: (id) => `/vendors/${id}`,
    categories: '/vendors/categories',
  },
  cart: {
    checkout: '/cart/checkout',
    applyCoupon: '/cart/coupons/validate',
  },
  tracking: {
    liveRoute: (orderId) => `/orders/${orderId}/stream-coordinates`,
  }
};

// ==========================================
// 10. LOCAL STORAGE ARCHIVE REPO KEYS
// ==========================================
export const StorageKeys = {
  USER_TOKEN: '@buza_secure_auth_token',
  USER_PROFILE: '@buza_user_profile_cache',
  ACTIVE_CART: '@buza_active_shopping_cart',
  THEME_PREFERENCE: '@buza_system_theme_mode',
  RECENT_SEARCHES: '@buza_historical_queries',
};

// ==========================================
// 11. SCENE NAVIGATION ROUTE REGISTRY
// ==========================================
export const Routes = {
  AUTH_STACK: 'AuthStack',
  MAIN_TABS: 'MainTabs',
  
  // Auth Screen Ecosystem
  LOGIN: 'LoginScreen',
  OTP_VERIFY: 'OtpVerifyScreen',
  
  // Core App Tab Target Screen Matrix
  HOME: 'HomeScreen',
  SEARCH: 'SearchScreen',
  ORDERS: 'OrdersHistoryScreen',
  PROFILE: 'ProfileSettingsScreen',
  
  // Feature Subflows
  VENDOR_DETAIL: 'VendorDetailScreen',
  CART_CHECKOUT: 'CartCheckoutScreen',
  ORDER_TRACKING: 'OrderTrackingScreen',
};

// ==========================================
// 12. RUNTIME PERMISSIONS MANIFEST
// ==========================================
export const AppPermissions = {
  LOCATION: Platform.select({
    ios: 'ios.permission.LOCATION_WHEN_IN_USE',
    android: 'android.permission.ACCESS_FINE_LOCATION',
  }),
  NOTIFICATIONS: Platform.select({
    ios: 'ios.permission.NOTIFICATIONS',
    android: 'android.permission.POST_NOTIFICATIONS',
  })
};

// ==========================================
// 13. DATA INTERNALS & REGEX VALIDATION LOGIC
// ==========================================
export const ValidationRegex = {
  email: null,
  phoneNumber: /^\+?[1-9]\d{1,14}$/, // E.164 compliance structure
  otpCode: /^\d{4,6}$/,
};

// ==========================================
// 14. FEATURE FLAGS & TOGGLE EXPERIMENTS
// ==========================================
export const FeatureFlags = {
  ENABLE_LOTTIE_ANIMATIONS: true,
  ENABLE_REALT_TIME_DRIVER_MAP_STREAMING: false, // Turned off for base core local mock verification
  ALLOW_APPLE_PAY: Platform.OS === 'ios',
  ALLOW_GOOGLE_PAY: Platform.OS === 'android',
  MAINTENANCE_MODE: false,
};

// ==========================================
// 15. BASE ROOT CONTEXT EXPORT CONFIG
// ==========================================
export const AppConfig = {
  appName: 'Buza',
  companyLegalName: 'Buza Technologies Ltd.',
  supportEmail: 'concierge@buzaapp.com',
  clientTimeoutMs: 15000,
};
