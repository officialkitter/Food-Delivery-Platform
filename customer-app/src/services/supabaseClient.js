import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

export const getSupabaseClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY. Add both to customer-app/.env before using Supabase OAuth.'
    );
  }

  cachedClient = createClient(supabaseUrl, supabaseAnonKey);
  return cachedClient;
};

// Lazy proxy keeps client initialization deferred until first method access.
export const supabase = new Proxy({}, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
