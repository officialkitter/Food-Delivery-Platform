const { mongoose } = require('../config/clients');

const RestaurantMenuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  cloudinary_banner_url: { type: String, required: true },
  cuisine_types: [{ type: String }],
  menu_sections: [{
    section_name: { type: String, required: true },
    items: [{
      name: { type: String, required: true },
      price: { type: Number, required: true },
      cloudinary_image_url: { type: String, required: true },
      modifiers: [{
        modifier_name: { type: String, required: true },
        is_required: { type: Boolean, default: false },
        options: [{
          name: { type: String, required: true },
          price_adjustment: { type: Number, default: 0.00 },
        }],
      }],
    }],
  }],
}, { timestamps: true });

const RestaurantMenu = mongoose.models.RestaurantMenu || mongoose.model('RestaurantMenu', RestaurantMenuSchema);

module.exports = {
  RestaurantMenu,
};
