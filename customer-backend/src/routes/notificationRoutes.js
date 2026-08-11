const express = require('express');
const { registerFirebaseToken, pushFirebase, pushFirebaseToUser } = require('../controllers/notificationsController');
const { requireSupabase, requireFirebase } = require('../middlewares');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/notifications/firebase/register-token', requireSupabase, asyncHandler(registerFirebaseToken));
router.post('/notifications/firebase/push', requireFirebase, asyncHandler(pushFirebase));
router.post('/notifications/firebase/push-to-user', requireFirebase, requireSupabase, asyncHandler(pushFirebaseToUser));

module.exports = router;
