const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
  color: String,
  size: String
});

const orderSchema = new mongoose.Schema({
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
  customerName: String,
  customerEmail: String,
  customerPhone: String,
  customerAddress: String,
  items: [orderItemSchema],
  total: Number,
  status: { type: String, default: 'pending' },
  orderNumber: { type: String, unique: true, sparse: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema); 