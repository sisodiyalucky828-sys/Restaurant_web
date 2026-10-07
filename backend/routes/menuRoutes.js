const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
  getCategories,
} = require('../controllers/menuController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', getMenuItems);
router.get('/categories', getCategories);
router.get('/:id', getMenuItemById);

// Admin protected routes
router.post('/', protect, adminOnly, createMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem);
router.patch('/:id/toggle-availability', protect, adminOnly, toggleAvailability);
router.delete('/:id', protect, adminOnly, deleteMenuItem);

module.exports = router;
