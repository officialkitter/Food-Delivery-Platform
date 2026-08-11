require('dotenv').config();

const API_V1 = '/api/v1';

const env = {
  PORT: process.env.PORT || 5001,
  HOST: process.env.HOST || '0.0.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || null,
  SUPABASE_URL: process.env.SUPABASE_URL || null,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || null,
  SUPABASE_PROFILE_TABLE: process.env.SUPABASE_PROFILE_TABLE || 'account_profiles',
  SUPABASE_ORDER_TABLE: process.env.SUPABASE_ORDER_TABLE || 'orders',
  SUPABASE_ORDER_ITEM_TABLE: process.env.SUPABASE_ORDER_ITEM_TABLE || 'order_items',
  SUPABASE_PAYMENT_TABLE: process.env.SUPABASE_PAYMENT_TABLE || 'payments',
  SUPABASE_COUPON_TABLE: process.env.SUPABASE_COUPON_TABLE || 'coupons',
  GOOGLE_EXPO_CLIENT_ID: process.env.GOOGLE_EXPO_CLIENT_ID || null,
  GOOGLE_WEB_CLIENT_ID: process.env.GOOGLE_WEB_CLIENT_ID || null,
  GOOGLE_ANDROID_CLIENT_ID: process.env.GOOGLE_ANDROID_CLIENT_ID || null,
  GOOGLE_IOS_CLIENT_ID: process.env.GOOGLE_IOS_CLIENT_ID || null,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || null,
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || null,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || null,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || null,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || null,
  CLOUDINARY_SECURE: String(process.env.CLOUDINARY_SECURE || 'true').toLowerCase() !== 'false',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || null,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || null,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || null,
  FIREBASE_SERVICE_ACCOUNT_JSON: process.env.FIREBASE_SERVICE_ACCOUNT_JSON || null,
  FIREBASE_SERVICE_ACCOUNT_PATH: process.env.FIREBASE_SERVICE_ACCOUNT_PATH || null,
  FIREBASE_PROFILE_SYNC: String(process.env.FIREBASE_PROFILE_SYNC || 'false').toLowerCase() === 'true',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '',
};

module.exports = {
  env,
  API_V1,
};
