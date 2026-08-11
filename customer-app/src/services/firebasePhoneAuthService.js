import { Platform } from 'react-native';
import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  getIdToken,
} from 'firebase/auth';
import { firebaseAuth } from './firebaseClient';
import { apiclient } from './apiClient';
import { ApiEndpoints } from '../constants/apiEndpoints';

export const firebasePhoneAuthService = {
  async requestPhoneVerificationCode(phoneNumber, appVerifier) {
    if (!firebaseAuth) {
      throw new Error('Firebase Auth is not initialized.');
    }

    if (!phoneNumber) {
      throw new Error('phoneNumber is required.');
    }

    if (Platform.OS !== 'web' && !appVerifier) {
      throw new Error('Phone verification on native requires an app verifier implementation.');
    }

    const confirmationResult = await signInWithPhoneNumber(firebaseAuth, String(phoneNumber), appVerifier);
    return confirmationResult;
  },

  async confirmPhoneVerificationCode(confirmationResult, verificationCode) {
    if (!confirmationResult || !verificationCode) {
      throw new Error('confirmationResult and verificationCode are required.');
    }

    const userCredential = await confirmationResult.confirm(String(verificationCode).trim());
    return userCredential;
  },

  async signInWithPhoneCredential(verificationId, verificationCode) {
    if (!verificationId || !verificationCode) {
      throw new Error('verificationId and verificationCode are required.');
    }

    const credential = PhoneAuthProvider.credential(String(verificationId), String(verificationCode).trim());
    const userCredential = await signInWithCredential(firebaseAuth, credential);
    return userCredential;
  },

  async verifyCurrentFirebaseSessionOnBackend(expectedProvider = 'phone') {
    if (!firebaseAuth?.currentUser) {
      throw new Error('No signed-in Firebase user found.');
    }

    const idToken = await getIdToken(firebaseAuth.currentUser, true);
    const response = await apiclient.post(ApiEndpoints.auth.firebaseVerifyIdToken, {
      idToken,
      expectedProvider,
    });

    return response;
  },
};
