import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabaseClient';
import { apiclient } from './apiClient';
import { ApiEndpoints } from '../constants/apiEndpoints';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PROFILE_TABLE = process.env.EXPO_PUBLIC_SUPABASE_PROFILE_TABLE || 'profiles';

const PROFILE_TABLE_CANDIDATES = [...new Set([
  PROFILE_TABLE,
  'profiles',
  'account_profiles',
  'customer_profiles',
])];

const isMissingRelationError = (error) => {
  const code = String(error?.code || '');
  const message = String(error?.message || '');
  return code === '42P01' || /relation .* does not exist/i.test(message);
};

const savePushTokenWithFallback = async (userId, payload) => {
  let lastError = null;

  for (const tableName of PROFILE_TABLE_CANDIDATES) {
    const { error } = await supabase
      .from(tableName)
      .update(payload)
      .eq('id', userId);

    if (!error) {
      return;
    }

    if (isMissingRelationError(error)) {
      lastError = error;
      continue;
    }

    throw error;
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error('No supported profile table found for push token storage.');
};

const registerPushTokenOnBackend = async (userId, payload) => {
  return apiclient.post(ApiEndpoints.notifications.firebase.registerToken, {
    userId,
    pushToken: payload.push_token,
    pushTokenType: payload.push_token_type,
  });
};

const getPushTokenData = async () => {
  const tokenResult = await Notifications.getDevicePushTokenAsync();
  if (!tokenResult?.data) {
    throw new Error('Failed to resolve a native device push token.');
  }

  return {
    token: tokenResult.data,
    tokenType: tokenResult.type || (Platform.OS === 'ios' ? 'apns' : 'fcm'),
  };
};

export async function registerForPushNotificationsAsync(userId) {
  if (!userId) {
    console.warn('[push] Missing userId. Push token registration skipped.');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF7F50',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[push] Permission not granted. Push token unavailable.');
    return null;
  }

  const { token, tokenType } = await getPushTokenData();
  const payload = {
    push_token: token,
    push_token_type: tokenType,
    push_token_updated_at: new Date().toISOString(),
  };

  try {
    await registerPushTokenOnBackend(userId, payload);
    return token;
  } catch (backendError) {
    console.warn('[push] Backend token registration failed, falling back to Supabase direct update:', backendError?.message || backendError);
  }

  try {
    await savePushTokenWithFallback(userId, payload);
  } catch (error) {
    console.error('[push] Error saving push token:', error?.message || error);
    throw error;
  }

  return token;
}

export async function registerPushTokenForCurrentUserAsync() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.warn('[push] Could not fetch signed-in user for token registration:', error.message);
    return null;
  }

  if (!user?.id) {
    return null;
  }

  return registerForPushNotificationsAsync(user.id);
}
