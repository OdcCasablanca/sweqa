const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');

const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
  try {
    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const order = new Order({
      store: req.body.storeId,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      customerPhone: req.body.customerPhone,
      customerAddress: req.body.customerAddress,
      items: req.body.items,
      total: req.body.total,
      status: 'pending',
      orderNumber
    });
    // Decrease product stock (qte) for each item
    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

// Get all orders for a store
router.get('/store/:storeId', async (req, res) => {
  try {
    const orders = await Order.find({ store: req.params.storeId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Update order status
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

module.exports = router; 