const {
  supabase,
  getMongoConnectionSnapshot,
  getCloudinarySnapshot,
  getFirebaseSnapshot,
  getSupabaseConnectionSnapshot,
} = require('../config/clients');

const getHealth = (_req, res) => {
  const mongo = getMongoConnectionSnapshot();
  const cloudinaryStatus = getCloudinarySnapshot();

  return res.status(200).json({
    success: true,
    message: 'Backend is healthy.',
    data: {
      services: {
        mongodb: mongo,
        supabaseConfigured: Boolean(supabase),
        cloudinaryConfigured: cloudinaryStatus.configured,
      },
    },
  });
};

const getInfrastructureHealth = async (_req, res) => {
  const mongo = getMongoConnectionSnapshot();
  const supabaseStatus = await getSupabaseConnectionSnapshot();
  const cloudinaryStatus = getCloudinarySnapshot();
  const firebaseStatus = getFirebaseSnapshot();

  const allReady = mongo.connected && supabaseStatus.connected && cloudinaryStatus.configured;
  const statusCode = allReady ? 200 : 503;

  return res.status(statusCode).json({
    success: allReady,
    message: allReady
      ? 'All backend infrastructures are connected and configured.'
      : 'One or more backend infrastructures are not ready.',
    data: {
      services: {
        mongodb: mongo,
        supabase: supabaseStatus,
        cloudinary: cloudinaryStatus,
        firebase: firebaseStatus,
      },
    },
  });
};

module.exports = {
  getHealth,
  getInfrastructureHealth,
};
