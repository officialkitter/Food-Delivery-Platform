const express = require('express');
const { authorizePayment } = require('../controllers/paymentsController');
const { requireSupabase } = require('../middlewares');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/payments/authorize', requireSupabase, asyncHandler(authorizePayment));

module.exports = router;
