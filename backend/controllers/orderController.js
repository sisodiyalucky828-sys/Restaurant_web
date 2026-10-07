const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { sendOrderNotification } = require('../services/smsService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public / Protected (attaches req.user if logged in)
const createOrder = async (req, res, next) => {
  try {
    const { items, customerDetails, paymentMethod } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'No items in order',
      });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name, email, and phone are required',
      });
    }

    // Verify items and prices from database
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbItem = await MenuItem.findById(item.menuItem || item._id);
      if (!dbItem) {
        return res.status(400).json({
          success: false,
          message: `Menu item not found: ${item.name || item._id}`,
        });
      }

      if (!dbItem.available) {
        return res.status(400).json({
          success: false,
          message: `Sorry, "${dbItem.name}" is currently sold out or unavailable.`,
        });
      }

      const qty = Number(item.quantity) || 1;
      const itemTotal = dbItem.price * qty;
      subtotal += itemTotal;

      validatedItems.push({
        menuItem: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: qty,
        image: dbItem.image,
      });
    }

    // Calculate tax and delivery
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% cafe tax
    const deliveryFee = customerDetails.orderType === 'delivery' ? 5.0 : 0.0;
    const total = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

    // 1. Save order to MongoDB first
    const order = await Order.create({
      user: req.user ? req.user._id : null,
      items: validatedItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      customerDetails: {
        name: customerDetails.name,
        email: customerDetails.email.toLowerCase(),
        phone: customerDetails.phone,
        address: customerDetails.address || '',
        orderType: customerDetails.orderType || 'dine-in',
        tableNumber: customerDetails.tableNumber || '',
        specialInstructions: customerDetails.specialInstructions || '',
      },
      paymentMethod: paymentMethod || 'cash_at_counter',
      paymentStatus: paymentMethod === 'card' || paymentMethod === 'upi' ? 'paid' : 'pending',
      orderStatus: 'Pending',
      notificationStatus: 'pending',
    });

    // 2. Send SMS notification to cafe owner (non-blocking for order success)
    try {
      const smsResult = await sendOrderNotification(order);
      order.notificationStatus = smsResult.status; // 'sent', 'failed', or 'disabled'
      if (smsResult.status === 'sent') {
        order.notificationSentAt = new Date();
      }
      await order.save();
    } catch (smsError) {
      // SMS failure must NEVER cancel the order
      console.error('[Order] SMS notification error (order is still valid):', smsError.message);
      order.notificationStatus = 'failed';
      await order.save();
    }

    // 3. Return success to the customer regardless of SMS outcome
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [{ user: req.user._id }, { 'customerDetails.email': req.user.email }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public / Private (checks ownership or admin)
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.orderStatus = status;
    }

    if (search) {
      query.$or = [
        { 'customerDetails.name': { $regex: search, $options: 'i' } },
        { 'customerDetails.email': { $regex: search, $options: 'i' } },
        { 'customerDetails.phone': { $regex: search, $options: 'i' } },
        { _id: search.match(/^[0-9a-fA-F]{24}$/) ? search : undefined },
      ].filter(Boolean);
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    const validStatuses = [
      'Pending',
      'Confirmed',
      'Preparing',
      'Ready',
      'Completed',
      'Cancelled',
    ];

    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    // Auto-mark payment paid if completed
    if (orderStatus === 'Completed' && order.paymentStatus !== 'paid') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${order.orderStatus}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
