const { env } = require('../config/env');

const getGoogleAuthConfig = (_req, res) => {
  const hasAuthClientIds = Boolean(
    env.GOOGLE_EXPO_CLIENT_ID || env.GOOGLE_WEB_CLIENT_ID || env.GOOGLE_ANDROID_CLIENT_ID || env.GOOGLE_IOS_CLIENT_ID
  );

  return res.status(200).json({
    success: true,
    data: {
      expoClientId: env.GOOGLE_EXPO_CLIENT_ID,
      webClientId: env.GOOGLE_WEB_CLIENT_ID,
      androidClientId: env.GOOGLE_ANDROID_CLIENT_ID,
      iosClientId: env.GOOGLE_IOS_CLIENT_ID,
      hasAuthClientIds,
      services: {
        mapsEnabled: Boolean(env.GOOGLE_MAPS_API_KEY),
        placesEnabled: Boolean(env.GOOGLE_PLACES_API_KEY),
      },
    },
  });
};

module.exports = {
  getGoogleAuthConfig,
};
