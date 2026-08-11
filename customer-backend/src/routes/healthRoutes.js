const express = require('express');
const { getHealth, getInfrastructureHealth } = require('../controllers/healthController');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.get('/health', getHealth);
router.get('/health/infrastructure', asyncHandler(getInfrastructureHealth));

module.exports = router;
