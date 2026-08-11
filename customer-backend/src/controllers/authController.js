const { supabase, firebaseApp, getFirebaseAuth } = require('../config/clients');
const { env } = require('../config/env');
const { normalizeIdentifier } = require('../utils/common');
const { syncProfileRecord, updateProfileWithFallback } = require('../services/profileService');

const register = async (req, res) => {
  const { fullName, identifier, password } = req.body;
  const authTarget = normalizeIdentifier(identifier);

  if (!fullName || !authTarget || !password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Invalid registration payload. fullName, identifier, and password(min 6 chars) are required.',
      error: 'Invalid registration payload. fullName, identifier, and password(min 6 chars) are required.',
    });
  }

  const signUpPayload = {
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  };

  if (authTarget.email) {
    signUpPayload.email = authTarget.email;
  } else {
    signUpPayload.phone = authTarget.phone;
  }

  const { data, error } = await supabase.auth.signUp(signUpPayload);
  if (error) {
    return res.status(400).json({ success: false, message: error.message, error: error.message });
  }

  const session = data?.session || null;
  const user = data?.user || null;

  const profileSync = await syncProfileRecord(user, fullName);

  return res.status(201).json({
    success: true,
    message: 'Registration successful.',
    data: {
      user,
      accessToken: session?.access_token || null,
      refreshToken: session?.refresh_token || null,
      profileSync,
    },
  });
};

const login = async (req, res) => {
  const { identifier, password } = req.body;
  const authTarget = normalizeIdentifier(identifier);

  if (!authTarget || !password) {
    return res.status(400).json({ success: false, message: 'identifier and password are required.', error: 'identifier and password are required.' });
  }

  const signInPayload = { password };
  if (authTarget.email) {
    signInPayload.email = authTarget.email;
  } else {
    signInPayload.phone = authTarget.phone;
  }

  const { data, error } = await supabase.auth.signInWithPassword(signInPayload);
  if (error) {
    return res.status(401).json({ success: false, message: error.message, error: error.message });
  }

  const user = data?.user || null;
  const session = data?.session || null;

  return res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      user,
      accessToken: session?.access_token || null,
      refreshToken: session?.refresh_token || null,
    },
  });
};

const googleAuth = async (req, res) => {
  const idToken = String(req.body?.idToken || '').trim();
  if (!idToken) {
    return res.status(400).json({ success: false, message: 'Google idToken is required.', error: 'Google idToken is required.' });
  }

  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token: idToken,
  });

  if (error) {
    return res.status(401).json({ success: false, message: error.message, error: error.message });
  }

  const user = data?.user || null;
  const session = data?.session || null;
  const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || null;
  const profileSync = await syncProfileRecord(user, fullName);

  return res.status(200).json({
    success: true,
    message: 'Google authentication successful.',
    data: {
      user,
      accessToken: session?.access_token || null,
      refreshToken: session?.refresh_token || null,
      profileSync,
    },
  });
};

const verifyFirebaseIdToken = async (req, res) => {
  const idToken = String(req.body?.idToken || '').trim();
  const expectedProvider = String(req.body?.expectedProvider || '').trim().toLowerCase();

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: 'idToken is required.',
      error: 'idToken is required.',
    });
  }

  try {
    const decodedToken = await getFirebaseAuth(firebaseApp).verifyIdToken(idToken, true);
    if (expectedProvider === 'phone' && !decodedToken?.phone_number) {
      return res.status(400).json({
        success: false,
        message: 'Verified Firebase token does not include a phone_number claim.',
        error: 'Token provider mismatch.',
      });
    }

    const firebaseUser = {
      uid: decodedToken.uid,
      phoneNumber: decodedToken.phone_number || null,
      email: decodedToken.email || null,
      emailVerified: Boolean(decodedToken.email_verified),
      authTime: decodedToken.auth_time || null,
      signInProvider: decodedToken.firebase?.sign_in_provider || null,
      claims: decodedToken,
    };

    let profileSync = null;
    if (env.FIREBASE_PROFILE_SYNC && supabase && decodedToken.uid) {
      profileSync = await updateProfileWithFallback(decodedToken.uid, {
        identifier: decodedToken.phone_number || decodedToken.email || decodedToken.uid,
        verification_state: 'verified',
        full_name: decodedToken.name || null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Firebase ID token verified successfully.',
      data: {
        firebaseUser,
        profileSync,
      },
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  verifyFirebaseIdToken,
};
