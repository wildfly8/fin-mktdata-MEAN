const mongoose = require('mongoose');

const SalesSchema = new mongoose.Schema(
  {
    itemId: String,
    itemName: String,
    itemPrice: Number,
    itemQty: Number,
    totalPrice: Number,
    updated: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model('sales', SalesSchema);