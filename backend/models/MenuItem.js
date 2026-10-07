const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be greater than or equal to 0'],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Coffee',
          'Tea',
          'Cold Drinks',
          'Breakfast',
          'Snacks',
          'Desserts',
          'Main Course',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    available: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    prepTime: {
      type: String,
      default: '5-10 min',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for fast search by name and description
menuItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
