import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDM179c5jk_E5bOEeQuN52pHT9IBzh9ubg',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'buza-app-v1.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'buza-app-v1',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'buza-app-v1.firebasestorage.app',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '139345800360',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:139345800360:web:741e77763332dd6b61a69d',
};

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

let firebaseAuth = null;
try {
  firebaseAuth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  firebaseAuth = getAuth(firebaseApp);
}

export { firebaseAuth };

export const getFirebaseMessagingIfAvailable = async () => {
  if (Platform.OS !== 'web') {
    return null;
  }

  const { isSupported, getMessaging } = await import('firebase/messaging');
  const supported = await isSupported();
  if (!supported) {
    return null;
  }

  return getMessaging(firebaseApp);
};
