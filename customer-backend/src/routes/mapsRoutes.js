const express = require('express');
const { reverseGeocode } = require('../controllers/mapsController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/maps/reverse-geocode', asyncHandler(reverseGeocode));

module.exports = router;
