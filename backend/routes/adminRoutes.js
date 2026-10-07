const express = require('express');
const router = express.Router();
const { getDashboardStats, getNotificationStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Protect all admin routes
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/notifications', getNotificationStatus);

module.exports = router;
