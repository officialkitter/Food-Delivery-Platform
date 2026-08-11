const {
  getMongoConnectionSnapshot,
  supabase,
  firebaseApp,
  firebaseInitializationError,
} = require('../config/clients');

const requireMongoConnection = (_req, res, next) => {
  const mongo = getMongoConnectionSnapshot();
  if (mongo.connected) {
    return next();
  }

  return res.status(503).json({
    success: false,
    message: 'MongoDB cluster is not connected. This endpoint requires MongoDB.',
    error: 'MongoDB cluster is not connected.',
    data: {
      services: {
        mongodb: mongo,
      },
    },
  });
};

const requireSupabase = (_req, res, next) => {
  if (supabase) {
    return next();
  }

  return res.status(500).json({
    success: false,
    message: 'Supabase is not configured on the backend.',
    error: 'Supabase is not configured on the backend.',
  });
};

const requireFirebase = (_req, res, next) => {
  if (firebaseApp) {
    return next();
  }

  return res.status(500).json({
    success: false,
    message: 'Firebase Admin is not configured on the backend.',
    error: firebaseInitializationError || 'Firebase Admin is not configured on the backend.',
  });
};

const jsonParseErrorHandler = (err, _req, res, next) => {
  const isJsonParseError =
    err?.type === 'entity.parse.failed' ||
    (err instanceof SyntaxError && typeof err?.message === 'string' && err.message.toLowerCase().includes('json'));

  if (isJsonParseError) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload.',
      error: 'Malformed JSON payload.',
    });
  }

  return next(err);
};

const globalErrorHandler = (err, _req, res, _next) => {
  const status = Number.isInteger(err?.status) ? err.status : 500;
  const message = err?.message || 'Internal server error.';
  return res.status(status).json({ success: false, error: message, message });
};

module.exports = {
  requireMongoConnection,
  requireSupabase,
  requireFirebase,
  jsonParseErrorHandler,
  globalErrorHandler,
};
