const { startServer } = require('./src/app');

startServer().catch((error) => {
  console.error('Backend startup failed:', error);
  process.exitCode = 1;
});
