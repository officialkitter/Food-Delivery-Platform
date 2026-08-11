const express = require('express');
const { API_V1 } = require('../config/env');

const healthRoutes = require('./healthRoutes');
const configRoutes = require('./configRoutes');
const mapsRoutes = require('./mapsRoutes');
const vendorRoutes = require('./vendorRoutes');
const cartRoutes = require('./cartRoutes');
const paymentRoutes = require('./paymentRoutes');
const authRoutes = require('./authRoutes');
const notificationRoutes = require('./notificationRoutes');
const securityRoutes = require('./securityRoutes');

const router = express.Router();

router.use(API_V1, healthRoutes);
router.use(API_V1, configRoutes);
router.use(API_V1, mapsRoutes);
router.use(API_V1, vendorRoutes);
router.use(API_V1, cartRoutes);
router.use(API_V1, paymentRoutes);
router.use(API_V1, authRoutes);
router.use(API_V1, notificationRoutes);

router.use(securityRoutes);

module.exports = router;
