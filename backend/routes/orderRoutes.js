const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// Create order (can be guest or logged-in)
router.post('/', optionalAuth, createOrder);

// Customer personal orders
router.get('/my-orders', protect, getMyOrders);

// Admin get all orders
router.get('/', protect, adminOnly, getAllOrders);

// Get single order
router.get('/:id', optionalAuth, getOrderById);

// Admin update order status
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
