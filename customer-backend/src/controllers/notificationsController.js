const { firebaseApp, getMessaging } = require('../config/clients');
const { toStringRecord } = require('../utils/common');
const { updateProfileWithFallback, getProfilePushTokenWithFallback } = require('../services/profileService');

const registerFirebaseToken = async (req, res) => {
  const userId = String(req.body?.userId || '').trim();
  const pushToken = String(req.body?.pushToken || '').trim();
  const pushTokenType = String(req.body?.pushTokenType || 'fcm').trim().toLowerCase();

  if (!userId || !pushToken) {
    return res.status(400).json({
      success: false,
      message: 'userId and pushToken are required.',
      error: 'userId and pushToken are required.',
    });
  }

  const profileUpdate = await updateProfileWithFallback(userId, {
    push_token: pushToken,
    push_token_type: pushTokenType,
    push_token_updated_at: new Date().toISOString(),
  });

  if (!profileUpdate.ok) {
    return res.status(500).json({
      success: false,
      message: 'Failed to save push token on Supabase profile table.',
      error: profileUpdate.error,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Push token registered successfully.',
    data: {
      table: profileUpdate.table,
    },
  });
};

const pushFirebase = async (req, res) => {
  const token = String(req.body?.token || '').trim();
  const title = String(req.body?.title || '').trim() || 'Buza Update';
  const body = String(req.body?.body || '').trim() || 'You have a new update.';
  const data = toStringRecord(req.body?.data || {});

  if (!token) {
    return res.status(400).json({
      success: false,
      message: 'FCM token is required.',
      error: 'FCM token is required.',
    });
  }

  const messageId = await getMessaging(firebaseApp).send({
    token,
    notification: {
      title,
      body,
    },
    data,
  });

  return res.status(200).json({
    success: true,
    message: 'Firebase push notification sent successfully.',
    data: {
      messageId,
    },
  });
};

const pushFirebaseToUser = async (req, res) => {
  const userId = String(req.body?.userId || '').trim();
  const title = String(req.body?.title || '').trim() || 'Buza Update';
  const body = String(req.body?.body || '').trim() || 'You have a new update.';
  const data = toStringRecord(req.body?.data || {});

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'userId is required.',
      error: 'userId is required.',
    });
  }

  const profileResult = await getProfilePushTokenWithFallback(userId);
  if (!profileResult.ok) {
    return res.status(500).json({
      success: false,
      message: 'Failed to read profile push token.',
      error: profileResult.error,
    });
  }

  const token = profileResult.data?.push_token;
  if (!token) {
    return res.status(404).json({
      success: false,
      message: 'No push token is registered for this user.',
      error: 'No push token is registered for this user.',
    });
  }

  const messageId = await getMessaging(firebaseApp).send({
    token,
    notification: {
      title,
      body,
    },
    data,
  });

  return res.status(200).json({
    success: true,
    message: 'Firebase push notification sent successfully.',
    data: {
      table: profileResult.table,
      messageId,
    },
  });
};

module.exports = {
  registerFirebaseToken,
  pushFirebase,
  pushFirebaseToUser,
};
