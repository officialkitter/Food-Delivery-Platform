const { env } = require('../config/env');
const { supabase } = require('../config/clients');

const profileTableCandidates = [...new Set([
  env.SUPABASE_PROFILE_TABLE,
  'profiles',
  'account_profiles',
  'customer_profiles',
].filter(Boolean))];

const isMissingRelation = (error) => {
  const code = String(error?.code || '');
  const message = String(error?.message || '').toLowerCase();
  return code === '42P01' || (message.includes('relation') && message.includes('does not exist'));
};

const updateProfileWithFallback = async (profileId, payload) => {
  if (!supabase) {
    return { ok: false, table: null, error: 'Supabase is not configured on backend.' };
  }

  for (const tableName of profileTableCandidates) {
    const { error } = await supabase
      .from(tableName)
      .update(payload)
      .eq('id', profileId);

    if (!error) {
      return { ok: true, table: tableName, error: null };
    }

    if (isMissingRelation(error)) {
      continue;
    }

    return { ok: false, table: tableName, error: error.message };
  }

  return { ok: false, table: null, error: 'No compatible Supabase profile table was found.' };
};

const getProfilePushTokenWithFallback = async (profileId) => {
  if (!supabase) {
    return { ok: false, table: null, data: null, error: 'Supabase is not configured on backend.' };
  }

  for (const tableName of profileTableCandidates) {
    const { data, error } = await supabase
      .from(tableName)
      .select('id,push_token,push_token_type')
      .eq('id', profileId)
      .maybeSingle();

    if (!error) {
      return { ok: true, table: tableName, data, error: null };
    }

    if (isMissingRelation(error)) {
      continue;
    }

    return { ok: false, table: tableName, data: null, error: error.message };
  }

  return { ok: false, table: null, data: null, error: 'No compatible Supabase profile table was found.' };
};

const syncProfileRecord = async (user, fullName) => {
  const profileSync = { table: env.SUPABASE_PROFILE_TABLE, ok: true, error: null };

  if (!user?.id || !supabase) {
    return profileSync;
  }

  const identifier = user.email || user.phone || null;

  const profilePayload = {
    id: user.id,
    full_name: fullName || null,
    identifier,
    verification_state: 'verified',
  };

  const { error: profileWriteError } = await supabase
    .from(env.SUPABASE_PROFILE_TABLE)
    .upsert(profilePayload, { onConflict: 'id' });

  if (profileWriteError) {
    console.warn(`Profile upsert skipped on table ${env.SUPABASE_PROFILE_TABLE}:`, profileWriteError.message);
    return {
      table: env.SUPABASE_PROFILE_TABLE,
      ok: false,
      error: profileWriteError.message,
    };
  }

  return profileSync;
};

module.exports = {
  updateProfileWithFallback,
  getProfilePushTokenWithFallback,
  syncProfileRecord,
};
