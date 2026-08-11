const toNumeric = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const isUuid = (value) => {
  const candidate = String(value || '').trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate);
};

const toStringRecord = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.entries(value).reduce((acc, [key, itemValue]) => {
    if (itemValue === undefined || itemValue === null) return acc;
    acc[String(key)] = typeof itemValue === 'string' ? itemValue : JSON.stringify(itemValue);
    return acc;
  }, {});
};

const normalizeIdentifier = (identifier) => {
  const value = String(identifier || '').trim();
  if (!value) return null;

  if (value.includes('@')) return { email: value.toLowerCase() };

  const normalizedPhone = value.replace(/[\s()-]/g, '');
  if (/^\+?\d{7,15}$/.test(normalizedPhone)) return { phone: normalizedPhone };

  return null;
};

module.exports = {
  toNumeric,
  isUuid,
  toStringRecord,
  normalizeIdentifier,
};
