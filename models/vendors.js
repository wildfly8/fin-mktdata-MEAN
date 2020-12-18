const mongoose = require('mongoose');

const VendorsSchema = new mongoose.Schema(
  {
    vendorId: String,
    vendorName: String,
    lastUpdated: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model('vendors', VendorsSchema);