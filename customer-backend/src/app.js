const express = require('express');
const cors = require('cors');
const { env } = require('./config/env');
const { connectMongo, mongoose } = require('./config/clients');
const { jsonParseErrorHandler, globalErrorHandler } = require('./middlewares');
const routes = require('./routes');

const app = express();
app.disable('x-powered-by');

const configuredCorsOrigins = String(env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: configuredCorsOrigins.length > 0 ? configuredCorsOrigins : true,
  credentials: true,
}));

app.use(express.json({ strict: true }));
app.use(jsonParseErrorHandler);

app.use(routes);

app.use(globalErrorHandler);

let serverInstance = null;
let shutdownInProgress = false;

const shutdownGracefully = async (signal) => {
  if (shutdownInProgress) return;
  shutdownInProgress = true;

  console.log(`${signal} received. Starting graceful shutdown.`);

  const forceExitTimer = setTimeout(() => {
    console.error('Graceful shutdown timeout reached. Forcing process exit.');
    process.exit(1);
  }, 10000);

  try {
    if (serverInstance) {
      await new Promise((resolve, reject) => {
        serverInstance.close((error) => {
          if (error) return reject(error);
          return resolve();
        });
      });
    }

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(false);
    }

    clearTimeout(forceExitTimer);
    process.exit(0);
  } catch (error) {
    clearTimeout(forceExitTimer);
    console.error('Graceful shutdown failed:', error);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectMongo();

  serverInstance = app.listen(env.PORT, env.HOST, () => {
    console.log(`Backend delivery server running on ${env.HOST}:${env.PORT} (${env.NODE_ENV})`);
  });

  process.on('SIGTERM', () => {
    shutdownGracefully('SIGTERM');
  });

  process.on('SIGINT', () => {
    shutdownGracefully('SIGINT');
  });

  return serverInstance;
};

module.exports = {
  app,
  startServer,
};
