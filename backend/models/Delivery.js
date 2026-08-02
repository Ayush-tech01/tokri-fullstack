const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    address: { type: String, required: true },
    deliveryDate: { type: Date, required: true }, // estimated / scheduled date
    deliveryStatus: {
      type: String,
      enum: ['Processing', 'Out for Delivery', 'Delivered'],
      default: 'Processing'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Delivery', deliverySchema);
