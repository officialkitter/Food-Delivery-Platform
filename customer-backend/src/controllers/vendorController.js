const {
  RestaurantMenu,
  SAMPLE_VENDOR_DATA,
  toVendorPayload,
  toProductPayload,
} = require('../services/vendorService');

const seedMarketplace = async (_req, res) => {
  const existing = await RestaurantMenu.countDocuments();
  if (existing > 0) {
    return res.status(200).json({
      success: true,
      message: 'Seed skipped because marketplace records already exist.',
      data: { existingCount: existing },
    });
  }

  const inserted = await RestaurantMenu.insertMany(SAMPLE_VENDOR_DATA);
  return res.status(201).json({
    success: true,
    message: 'Marketplace seed inserted successfully.',
    data: { insertedCount: inserted.length },
  });
};

const getHomeFeed = async (req, res) => {
  const search = String(req.query.search || '').trim();
  const query = { is_active: true };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { cuisine_types: { $elemMatch: { $regex: search, $options: 'i' } } },
      { 'menu_sections.items.name': { $regex: search, $options: 'i' } },
    ];
  }

  const menus = await RestaurantMenu.find(query).sort({ createdAt: -1 }).limit(24).lean();
  const vendors = menus.map(toVendorPayload);
  const products = menus.flatMap(toProductPayload).slice(0, 30);
  const categories = [...new Set(menus.flatMap((row) => row.cuisine_types || []))];

  return res.status(200).json({
    success: true,
    data: {
      currency: 'TZS',
      vendors,
      products,
      categories,
    },
  });
};

const searchVendors = async (req, res) => {
  const search = String(req.query.search || '').trim();
  const query = { is_active: true };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { cuisine_types: { $elemMatch: { $regex: search, $options: 'i' } } },
    ];
  }

  const menus = await RestaurantMenu.find(query).sort({ createdAt: -1 }).limit(40).lean();
  const vendors = menus.map(toVendorPayload);
  return res.status(200).json({ success: true, data: vendors });
};

const getCategories = async (_req, res) => {
  const categories = await RestaurantMenu.distinct('cuisine_types', { is_active: true });
  return res.status(200).json({ success: true, data: categories.filter(Boolean) });
};

const getVendorById = async (req, res) => {
  const vendor = await RestaurantMenu.findOne({ _id: req.params.id, is_active: true }).lean();
  if (!vendor) {
    return res.status(404).json({ success: false, error: 'Vendor not found.' });
  }

  return res.status(200).json({
    success: true,
    data: {
      ...toVendorPayload(vendor),
      menu: vendor.menu_sections || [],
    },
  });
};

const getRestaurantMenu = async (req, res) => {
  const targetMenu = await RestaurantMenu.findOne({ _id: req.params.id, is_active: true });
  if (!targetMenu) {
    return res.status(404).json({ success: false, error: 'Target resource entity location not resolved.' });
  }

  return res.status(200).json({ success: true, data: targetMenu });
};

module.exports = {
  seedMarketplace,
  getHomeFeed,
  searchVendors,
  getCategories,
  getVendorById,
  getRestaurantMenu,
};
