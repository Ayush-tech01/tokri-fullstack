const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true }, // e.g. 'fruits-veg'
    name: { type: String, required: true, trim: true }, // e.g. 'Fruits & Vegetables'
    icon: { type: String, default: '🛒' }, // emoji used on the category card
    stamp: { type: String, default: 'FRESH' }, // small badge text, e.g. 'FARM FRESH'
    themeColor: {
      type: String,
      enum: ['spinach', 'turmeric', 'turmericDeep', 'brinjal', 'slate', 'tomato'],
      default: 'spinach'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
