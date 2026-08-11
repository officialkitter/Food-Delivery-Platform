const { RestaurantMenu } = require('../models');

const SAMPLE_VENDOR_DATA = [
  {
    name: 'Buza Grill House',
    cloudinary_banner_url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80',
    cuisine_types: ['Burgers', 'Fries', 'Wings'],
    is_active: true,
    menu_sections: [
      {
        section_name: 'Chef Picks',
        items: [
          {
            name: 'Premium Burger',
            price: 22000,
            cloudinary_image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
            modifiers: [],
          },
          {
            name: 'French Fries Basket',
            price: 12000,
            cloudinary_image_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80',
            modifiers: [],
          },
        ],
      },
    ],
  },
  {
    name: 'Fresh Drinks & Shakes Bar',
    cloudinary_banner_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80',
    cuisine_types: ['Juices', 'Smoothies', 'Cold Drinks'],
    is_active: true,
    menu_sections: [
      {
        section_name: 'Cold Refreshments',
        items: [
          {
            name: 'Mango Smoothie',
            price: 9000,
            cloudinary_image_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=600&q=80',
            modifiers: [],
          },
          {
            name: 'Tropical Juice Mix',
            price: 7500,
            cloudinary_image_url: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=600&q=80',
            modifiers: [],
          },
        ],
      },
    ],
  },
];

const safeImage = (imageUrl) => {
  const fallback = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80';
  return imageUrl || fallback;
};

const toVendorPayload = (menuDoc) => {
  const firstSection = menuDoc?.menu_sections?.[0];
  return {
    id: String(menuDoc?._id || ''),
    name: menuDoc?.name || 'Unnamed Vendor',
    ETA: '15-30 min',
    delivery: 'Free',
    rating: '4.8',
    specialty: Array.isArray(menuDoc?.cuisine_types) && menuDoc.cuisine_types.length > 0
      ? menuDoc.cuisine_types.join(', ')
      : 'Food & Drinks',
    image: safeImage(menuDoc?.cloudinary_banner_url),
    categories: Array.isArray(menuDoc?.cuisine_types) ? menuDoc.cuisine_types : [],
    sampleItems: Array.isArray(firstSection?.items) ? firstSection.items.slice(0, 3).map((item) => item.name) : [],
  };
};

const toProductPayload = (menuDoc) => {
  const rows = [];
  for (const section of menuDoc?.menu_sections || []) {
    for (const item of section?.items || []) {
      rows.push({
        id: `${String(menuDoc?._id || 'vendor')}:${String(item?._id || item?.name || 'item')}`,
        name: item?.name || 'Unnamed Product',
        vendor: menuDoc?.name || 'Vendor',
        rating: '4.8',
        price: Number(item?.price || 0),
        image: safeImage(item?.cloudinary_image_url),
        section: section?.section_name || 'Menu',
        vendorId: String(menuDoc?._id || ''),
      });
    }
  }
  return rows;
};

module.exports = {
  RestaurantMenu,
  SAMPLE_VENDOR_DATA,
  toVendorPayload,
  toProductPayload,
};
