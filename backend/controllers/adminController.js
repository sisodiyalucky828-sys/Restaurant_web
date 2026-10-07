const Order = require('../models/Order');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Reservation = require('../models/Reservation');

// @desc    Get aggregated dashboard stats for Admin
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Basic counts
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalMenuItems = await MenuItem.countDocuments();
    const totalReservations = await Reservation.countDocuments();

    // 2. Revenue calculation (orders that are not Cancelled)
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? Math.round(revenueAgg[0].totalRevenue * 100) / 100 : 0;

    // 3. Status breakdown
    const orderStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Ready',
      'Completed',
      'Cancelled',
    ];

    const statusCountsAgg = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    const statusCounts = {};
    orderStatuses.forEach((st) => {
      statusCounts[st] = 0;
    });
    statusCountsAgg.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    // 4. Reservations by status
    const resvStatusesAgg = await Reservation.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const reservationCounts = {
      Pending: 0,
      Confirmed: 0,
      Rejected: 0,
      Completed: 0,
    };
    resvStatusesAgg.forEach((item) => {
      if (reservationCounts[item._id] !== undefined) {
        reservationCounts[item._id] = item.count;
      }
    });

    // 5. Recent 6 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .select('customerDetails total items orderStatus paymentStatus createdAt');

    // 6. Recent 5 reservations
    const recentReservations = await Reservation.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Menu items count by category
    const categoryBreakdown = await MenuItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalRevenue,
        totalCustomers,
        totalMenuItems,
        totalReservations,
        statusCounts,
        reservationCounts,
        recentOrders,
        recentReservations,
        categoryBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get SMS notification status for admin dashboard
// @route   GET /api/admin/notifications
// @access  Private/Admin
const getNotificationStatus = async (req, res, next) => {
  try {
    const ownerPhone = process.env.OWNER_PHONE_NUMBER || '';
    const smsEnabled = process.env.SMS_ENABLED === 'true';
    const smsProvider = process.env.SMS_PROVIDER || 'twilio';

    // Mask the phone number for display: +91****5938
    let maskedPhone = 'Not configured';
    if (ownerPhone && ownerPhone.length > 6) {
      const prefix = ownerPhone.slice(0, 3);
      const suffix = ownerPhone.slice(-4);
      maskedPhone = `${prefix}${'*'.repeat(ownerPhone.length - 7)}${suffix}`;
    }

    // Get notification statistics from orders
    const notificationStatsAgg = await Order.aggregate([
      {
        $group: {
          _id: '$notificationStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const notificationStats = { pending: 0, sent: 0, failed: 0, disabled: 0 };
    notificationStatsAgg.forEach((item) => {
      if (item._id && notificationStats[item._id] !== undefined) {
        notificationStats[item._id] = item.count;
      } else if (!item._id) {
        // Orders created before the notification field was added
        notificationStats.pending += item.count;
      }
    });

    // Get last notification
    const lastNotifiedOrder = await Order.findOne({
      notificationStatus: { $in: ['sent', 'failed'] },
    })
      .sort({ createdAt: -1 })
      .select('notificationStatus notificationSentAt createdAt customerDetails.name _id');

    res.status(200).json({
      success: true,
      data: {
        ownerPhone: maskedPhone,
        smsEnabled,
        smsProvider,
        notificationStats,
        lastNotification: lastNotifiedOrder
          ? {
              orderId: lastNotifiedOrder._id,
              status: lastNotifiedOrder.notificationStatus,
              sentAt: lastNotifiedOrder.notificationSentAt,
              orderDate: lastNotifiedOrder.createdAt,
              customerName: lastNotifiedOrder.customerDetails?.name || 'N/A',
            }
          : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getNotificationStatus,
};
