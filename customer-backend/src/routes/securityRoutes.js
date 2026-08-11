const express = require('express');
const { createDispute, lockout } = require('../controllers/securityController');
const { requireSupabase } = require('../middlewares');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/api/disputes', asyncHandler(createDispute));
router.post('/api/security/lockout', requireSupabase, asyncHandler(lockout));

module.exports = router;
