const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
  },
  image: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    customerDetails: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
      },
      email: {
        type: String,
        required: [true, 'Customer email is required'],
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        required: [true, 'Customer phone is required'],
        trim: true,
      },
      address: {
        type: String,
        default: '',
        trim: true,
      },
      orderType: {
        type: String,
        enum: ['dine-in', 'takeaway', 'delivery'],
        default: 'dine-in',
      },
      tableNumber: {
        type: String,
        default: '',
      },
      specialInstructions: {
        type: String,
        default: '',
        trim: true,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'upi', 'cash_at_counter'],
      default: 'cash_at_counter',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    notificationStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'disabled'],
      default: 'pending',
    },
    notificationSentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
