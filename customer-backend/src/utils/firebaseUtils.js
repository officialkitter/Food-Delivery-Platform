const fs = require('node:fs');
const path = require('node:path');

const normalizeMultilineSecret = (value) => String(value || '').replaceAll('\\n', '\n');

const readFirebaseServiceAccount = (env) => {
  if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (error) {
      console.warn('FIREBASE_SERVICE_ACCOUNT_JSON is present but invalid JSON:', error.message);
      return null;
    }
  }

  if (env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    try {
      const absolutePath = path.isAbsolute(env.FIREBASE_SERVICE_ACCOUNT_PATH)
        ? env.FIREBASE_SERVICE_ACCOUNT_PATH
        : path.join(process.cwd(), env.FIREBASE_SERVICE_ACCOUNT_PATH);

      if (fs.existsSync(absolutePath)) {
        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        return JSON.parse(fileContent);
      }

      console.warn(`FIREBASE_SERVICE_ACCOUNT_PATH does not exist at ${absolutePath}.`);
    } catch (error) {
      console.warn('Unable to load Firebase service account file:', error.message);
      return null;
    }
  }

  if (env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    return {
      project_id: env.FIREBASE_PROJECT_ID,
      client_email: env.FIREBASE_CLIENT_EMAIL,
      private_key: normalizeMultilineSecret(env.FIREBASE_PRIVATE_KEY),
    };
  }

  return null;
};

module.exports = {
  normalizeMultilineSecret,
  readFirebaseServiceAccount,
};
