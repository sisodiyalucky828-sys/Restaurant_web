const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - must be authenticated
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, please log in to access this resource',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_velvet_brew_jwt_key_2025_prod'
    );
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token is invalid or expired',
    });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required',
    });
  }
};

// Optional auth - attaches user if valid token present, otherwise proceeds without error
const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_velvet_brew_jwt_key_2025_prod'
      );
      req.user = await User.findById(decoded.id);
    } catch (err) {
      // Ignore token error for optional auth
      req.user = null;
    }
  }

  next();
};

module.exports = { protect, adminOnly, optionalAuth };
