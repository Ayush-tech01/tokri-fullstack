const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, default: null },
    unit: { type: String, required: true }, // e.g. '1 kg', '500 ml'
    veg: { type: Boolean, default: true },
    icon: { type: String, default: '🛒' }, // emoji used as product art
    rating: { type: Number, default: 4, min: 0, max: 5 },
    stock: { type: Number, default: 20, min: 0 },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
