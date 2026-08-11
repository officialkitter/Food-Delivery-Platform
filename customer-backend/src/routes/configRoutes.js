const express = require('express');
const { getGoogleAuthConfig } = require('../controllers/configController');

const router = express.Router();

router.get('/config/google-auth', getGoogleAuthConfig);

module.exports = router;
