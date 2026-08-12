const fs = require('node:fs');
const path = require('node:path');

const normalizeMultilineSecret = (value) => {
  let normalized = String(value || '').trim();
  if (!normalized) return normalized;

  if (
    (normalized.startsWith('"') && normalized.endsWith('"')) ||
    (normalized.startsWith("'") && normalized.endsWith("'"))
  ) {
    normalized = normalized.slice(1, -1);
  }

  normalized = normalized.replaceAll(String.raw`\r`, '').replaceAll(String.raw`\n`, '\n');

  if (!normalized.includes('BEGIN PRIVATE KEY')) {
    const compactBody = normalized.replace(/\s+/g, '').replace(/^n(?=MII)/, '');
    if (/^MII[A-Za-z0-9+/=]+$/.test(compactBody)) {
      const lines = compactBody.match(/.{1,64}/g) || [compactBody];
      normalized = [
        '-----BEGIN PRIVATE KEY-----',
        ...lines,
        '-----END PRIVATE KEY-----',
      ].join('\n');
    }
  }

  return normalized;
};

const readFirebaseServiceAccount = (env) => {
  if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      return JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (error) {
      console.warn('FIREBASE_SERVICE_ACCOUNT_JSON is present but invalid JSON:', error.message);
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

  if (env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    try {
      const absolutePath = path.isAbsolute(env.FIREBASE_SERVICE_ACCOUNT_PATH)
        ? env.FIREBASE_SERVICE_ACCOUNT_PATH
        : path.join(process.cwd(), env.FIREBASE_SERVICE_ACCOUNT_PATH);

      if (fs.existsSync(absolutePath)) {
        const fileContent = fs.readFileSync(absolutePath, 'utf8');
        return JSON.parse(fileContent);
      }

      console.warn(`FIREBASE_SERVICE_ACCOUNT_PATH was set but does not exist at ${absolutePath}. Falling back to other Firebase env vars if available.`);
    } catch (error) {
      console.warn('Unable to load Firebase service account file:', error.message);
      return null;
    }
  }

  return null;
};

module.exports = {
  normalizeMultilineSecret,
  readFirebaseServiceAccount,
};
