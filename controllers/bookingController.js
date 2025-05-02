import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json({
      message: 'Booking saved successfully ✅',
      booking,
    });
  } catch (error) {
    console.error('❌ Error saving booking:', error);
    res.status(500).json({
      message: 'Server error',
      error,
    });
  }
};
