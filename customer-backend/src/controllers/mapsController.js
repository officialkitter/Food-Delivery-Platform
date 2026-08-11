const { env } = require('../config/env');

const reverseGeocode = async (req, res) => {
  const latitude = Number(req.query.latitude);
  const longitude = Number(req.query.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return res.status(400).json({
      success: false,
      error: 'latitude and longitude query params are required numeric values.',
    });
  }

  if (!env.GOOGLE_MAPS_API_KEY) {
    return res.status(500).json({
      success: false,
      error: 'GOOGLE_MAPS_API_KEY is missing on backend.',
    });
  }

  const googleUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${env.GOOGLE_MAPS_API_KEY}`;
  const googleResponse = await fetch(googleUrl);
  const payload = await googleResponse.json();

  if (!googleResponse.ok || payload?.status !== 'OK' || !Array.isArray(payload?.results) || payload.results.length === 0) {
    return res.status(502).json({
      success: false,
      error: payload?.error_message || `Google geocoding failed with status ${payload?.status || googleResponse.status}.`,
    });
  }

  const bestResult = payload.results[0];
  const components = Array.isArray(bestResult.address_components) ? bestResult.address_components : [];

  const getComponent = (types) => {
    const target = components.find((entry) => types.some((type) => entry?.types?.includes(type)));
    return target?.long_name || '';
  };

  const streetNumber = getComponent(['street_number']);
  const route = getComponent(['route']);
  const city = getComponent(['locality', 'administrative_area_level_2', 'administrative_area_level_1']);
  const country = getComponent(['country']);
  const street = [streetNumber, route].filter(Boolean).join(' ').trim() || bestResult.formatted_address;

  return res.status(200).json({
    success: true,
    data: {
      label: 'Current Location',
      street,
      city,
      country,
      formattedAddress: bestResult.formatted_address,
      coordinates: { latitude, longitude },
    },
  });
};

module.exports = {
  reverseGeocode,
};
