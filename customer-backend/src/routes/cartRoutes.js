const express = require('express');
const { validateCoupon, checkout, getCurrentCart } = require('../controllers/cartController');
const { requireSupabase } = require('../middlewares');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/cart/coupons/validate', requireSupabase, asyncHandler(validateCoupon));
router.post('/cart/checkout', requireSupabase, asyncHandler(checkout));
router.get('/cart/current', requireSupabase, asyncHandler(getCurrentCart));

module.exports = router;
