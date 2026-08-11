const express = require('express');
const cors = require('cors');
const { env } = require('./config/env');
const { connectMongo } = require('./config/clients');
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

const startServer = async () => {
  await connectMongo();

  app.listen(env.PORT, env.HOST, () => {
    console.log(`Backend delivery server running on ${env.HOST}:${env.PORT} (${env.NODE_ENV})`);
  });
};

module.exports = {
  app,
  startServer,
};
