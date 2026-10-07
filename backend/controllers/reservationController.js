const Reservation = require('../models/Reservation');

// @desc    Create new table reservation
// @route   POST /api/reservations
// @access  Public / Optional Auth
const createReservation = async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, specialRequest } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (name, email, phone, date, time, guests)',
      });
    }

    const numGuests = Number(guests);
    if (isNaN(numGuests) || numGuests < 1 || numGuests > 30) {
      return res.status(400).json({
        success: false,
        message: 'Guest count must be between 1 and 30',
      });
    }

    // Validate date format and ensure it's not in the past
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(reservationDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reservation date format',
      });
    }

    // Optional user attachment
    const userId = req.user ? req.user._id : null;

    const reservation = await Reservation.create({
      user: userId,
      name,
      email: email.toLowerCase(),
      phone,
      date,
      time,
      guests: numGuests,
      specialRequest: specialRequest || '',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Reservation request submitted successfully! We will confirm your table shortly.',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's reservations
// @route   GET /api/reservations/my-reservations
// @access  Private
const getMyReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({
      $or: [{ user: req.user._id }, { email: req.user.email }],
    }).sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reservations (Admin)
// @route   GET /api/reservations
// @access  Private/Admin
const getAllReservations = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    const reservations = await Reservation.find(query).sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation status (Admin)
// @route   PUT /api/reservations/:id/status
// @access  Private/Admin
const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Confirmed', 'Rejected', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid reservation status. Allowed: ${validStatuses.join(', ')}`,
      });
    }

    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    reservation.status = status;
    await reservation.save();

    res.status(200).json({
      success: true,
      message: `Reservation marked as ${status}`,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reservation (Admin)
// @route   DELETE /api/reservations/:id
// @access  Private/Admin
const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Reservation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation,
};
