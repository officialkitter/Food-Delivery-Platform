const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');
const { v2: cloudinary } = require('cloudinary');
const { initializeApp: initializeFirebaseApp, cert, getApps: getFirebaseApps } = require('firebase-admin/app');
const { getAuth: getFirebaseAuth } = require('firebase-admin/auth');
const { getMessaging } = require('firebase-admin/messaging');
const { env } = require('./env');
const { normalizeMultilineSecret, readFirebaseServiceAccount } = require('../utils/firebaseUtils');

let supabase = null;
if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  console.log('Supabase infrastructure service client initialized successfully.');
} else {
  console.warn('Supabase env vars missing. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable auth routes.');
}

let isCloudinaryConfigured = false;
if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: env.CLOUDINARY_SECURE,
  });
  isCloudinaryConfigured = true;
  console.log('Cloudinary media client initialized successfully.');
} else {
  console.warn('Cloudinary env vars missing. Configure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to enable media workflows.');
}

let firebaseApp = null;
let firebaseInitializationError = null;
const firebaseServiceAccount = readFirebaseServiceAccount(env);

if (firebaseServiceAccount?.project_id && firebaseServiceAccount?.client_email && firebaseServiceAccount?.private_key) {
  try {
    firebaseApp = getFirebaseApps().length > 0
      ? getFirebaseApps()[0]
      : initializeFirebaseApp({
        credential: cert({
          projectId: firebaseServiceAccount.project_id,
          clientEmail: firebaseServiceAccount.client_email,
          privateKey: normalizeMultilineSecret(firebaseServiceAccount.private_key),
        }),
      });

    console.log('Firebase Admin infrastructure client initialized successfully.');
  } catch (error) {
    firebaseInitializationError = error.message;
    console.warn('Firebase Admin initialization failed:', error.message);
  }
} else {
  firebaseInitializationError = 'Firebase Admin credentials are not configured.';
  console.warn('Firebase env vars missing. Configure service account credentials to enable FCM and phone token verification.');
}

const connectMongo = async () => {
  if (!env.MONGODB_URI) {
    console.warn('MongoDB URI not provided. Mongo-backed routes may fail until MONGODB_URI is configured.');
    return;
  }

  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connection initialized successfully.');
  } catch (err) {
    console.error('MongoDB connection error encountered:', err);
  }
};

const getMongoConnectionSnapshot = () => {
  const readyState = mongoose.connection.readyState;
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    connected: readyState === 1,
    state: stateMap[readyState] || 'unknown',
    database: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
  };
};

const getCloudinarySnapshot = () => ({
  configured: isCloudinaryConfigured,
  cloudName: env.CLOUDINARY_CLOUD_NAME,
  secure: env.CLOUDINARY_SECURE,
});

const getFirebaseSnapshot = () => ({
  configured: Boolean(firebaseApp),
  projectId: firebaseServiceAccount?.project_id || env.FIREBASE_PROJECT_ID || null,
  clientEmail: firebaseServiceAccount?.client_email || env.FIREBASE_CLIENT_EMAIL || null,
  error: firebaseInitializationError,
});

const withTimeout = async (promise, timeoutMs = 7000) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms.`)), timeoutMs)),
]);

const getSupabaseConnectionSnapshot = async () => {
  if (!supabase) {
    return {
      configured: false,
      connected: false,
      error: 'Supabase is not configured.',
    };
  }

  try {
    const { error } = await withTimeout(
      supabase.auth.admin.listUsers({ page: 1, perPage: 1 }),
      7000
    );

    if (error) {
      return {
        configured: true,
        connected: false,
        error: error.message,
      };
    }

    return {
      configured: true,
      connected: true,
      error: null,
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      error: error.message,
    };
  }
};

module.exports = {
  mongoose,
  cloudinary,
  supabase,
  firebaseApp,
  firebaseInitializationError,
  firebaseServiceAccount,
  getFirebaseAuth,
  getMessaging,
  connectMongo,
  getMongoConnectionSnapshot,
  getCloudinarySnapshot,
  getFirebaseSnapshot,
  getSupabaseConnectionSnapshot,
};
