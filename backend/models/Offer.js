const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, default: 'Offer' }, // e.g. 'FLAT DISCOUNT'
    title: { type: String, required: true }, // e.g. '20% off your first thela'
    description: { type: String, default: '' },
    code: { type: String, default: null },
    discountType: { type: String, enum: ['percentage', 'flat', 'combo'], default: 'percentage' },
    discountValue: { type: Number, default: 0 },
    theme: { type: String, enum: ['spinach', 'turmeric', 'tomato'], default: 'spinach' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
