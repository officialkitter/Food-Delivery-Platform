const express = require('express');
const { register, login, googleAuth, verifyFirebaseIdToken } = require('../controllers/authController');
const { requireSupabase, requireFirebase } = require('../middlewares');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/auth/register', requireSupabase, asyncHandler(register));
router.post('/auth/login', requireSupabase, asyncHandler(login));
router.post('/auth/google', requireSupabase, asyncHandler(googleAuth));
router.post('/auth/firebase/verify-id-token', requireFirebase, asyncHandler(verifyFirebaseIdToken));

module.exports = router;
