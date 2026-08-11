const express = require('express');
const {
  seedMarketplace,
  getHomeFeed,
  searchVendors,
  getCategories,
  getVendorById,
  getRestaurantMenu,
} = require('../controllers/vendorController');
const { requireMongoConnection } = require('../middlewares');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

router.post('/admin/seed-marketplace', requireMongoConnection, asyncHandler(seedMarketplace));
router.get('/vendors/home-feed', requireMongoConnection, asyncHandler(getHomeFeed));
router.get('/vendors/search', requireMongoConnection, asyncHandler(searchVendors));
router.get('/vendors/categories', requireMongoConnection, asyncHandler(getCategories));
router.get('/vendors/:id', requireMongoConnection, asyncHandler(getVendorById));

router.get('/restaurants/:id/menu', asyncHandler(getRestaurantMenu));

module.exports = router;
