const express = require('express');
const router = express.Router();
const {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
} = require('../controllers/reservationController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// Create reservation (guest or user)
router.post('/', optionalAuth, createReservation);

// Customer personal reservations
router.get('/my-reservations', protect, getMyReservations);

// Admin routes
router.get('/', protect, adminOnly, getAllReservations);
router.put('/:id/status', protect, adminOnly, updateReservationStatus);
router.delete('/:id', protect, adminOnly, deleteReservation);

module.exports = router;
