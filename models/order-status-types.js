const mongoose = require('mongoose');

const OrderStatusTypesSchema = new mongoose.Schema(
  {
    code: String,
    value: String,
    lastUpdated: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model('order_status_types', OrderStatusTypesSchema);