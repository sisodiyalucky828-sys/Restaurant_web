const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items (with search, category filter, and availability)
// @route   GET /api/menu
// @access  Public
const getMenuItems = async (req, res, next) => {
  try {
    const { category, search, availableOnly, sort } = req.query;
    let query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by availability (defaults to all unless explicitly set or customer view)
    if (availableOnly === 'true') {
      query.available = true;
    }

    // Search query across name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Sort
    let sortBy = { createdAt: -1 };
    if (sort === 'price-low') sortBy = { price: 1 };
    if (sort === 'price-high') sortBy = { price: -1 };
    if (sort === 'name') sortBy = { name: 1 };
    if (sort === 'rating') sortBy = { rating: -1 };

    const items = await MenuItem.find(query).sort(sortBy);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
const getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private/Admin
const createMenuItem = async (req, res, next) => {
  try {
    const { name, description, price, image, category, available, tags, prepTime } = req.body;

    if (!name || !description || price === undefined || !image || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, price, image, and category',
      });
    }

    const item = await MenuItem.create({
      name,
      description,
      price: Number(price),
      image,
      category,
      available: available !== undefined ? available : true,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
      prepTime: prepTime || '5-10 min',
    });

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
const updateMenuItem = async (req, res, next) => {
  try {
    let item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    const { name, description, price, image, category, available, tags, prepTime } = req.body;

    const updatedData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(image && { image }),
      ...(category && { category }),
      ...(available !== undefined && { available }),
      ...(tags && {
        tags: Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim()),
      }),
      ...(prepTime && { prepTime }),
    };

    item = await MenuItem.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Menu item updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle menu item availability
// @route   PATCH /api/menu/:id/toggle-availability
// @access  Private/Admin
const toggleAvailability = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    item.available = !item.available;
    await item.save();

    res.status(200).json({
      success: true,
      message: `Item is now ${item.available ? 'available' : 'unavailable'}`,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category summary
// @route   GET /api/menu/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = [
      'Coffee',
      'Tea',
      'Cold Drinks',
      'Breakfast',
      'Snacks',
      'Desserts',
      'Main Course',
    ];

    const counts = await MenuItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id] = c.count;
    });

    const result = categories.map((cat) => ({
      name: cat,
      count: countMap[cat] || 0,
    }));

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  toggleAvailability,
  deleteMenuItem,
  getCategories,
};
