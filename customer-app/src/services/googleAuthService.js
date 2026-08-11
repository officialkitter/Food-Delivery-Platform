import { useCallback } from 'react';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { getSupabaseClient } from './supabaseClient';

WebBrowser.maybeCompleteAuthSession();

const redirectTo = makeRedirectUri({
  scheme: 'buza',
  projectNameForProxy: 'buza-app',
});

console.log('Expected Redirect URI:', redirectTo);

export const useGoogleAuthService = () => {
  const signInWithGoogle = useCallback(async () => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error('Authentication error:', error.message);
      throw new Error(error.message);
    }

    return { data, error };
  }, []);

  return {
    signInWithGoogle,
    isGoogleAuthReady: true,
  };
};
