const Booking = require('../models/Booking');
const { sendSMS } = require('../utils/sms');

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    // 📲 Extract phone number and name for SMS
    const phone = booking.phoneNumber || req.body.phoneNumber;
    const name = booking.name || req.body.name || 'Customer';

    // 📨 Send SMS if phone number exists
    if (phone) {
      const message = `Hi ${name}, your booking at Heavenly Rhythms Studio was successful. See you soon! 🎶`;
      await sendSMS(phone, message);
      console.log(`✅ SMS sent to ${phone}`);
    } else {
      console.warn('⚠️ Phone number missing. SMS not sent.');
    }

    res.status(201).json({ message: 'Booking saved and SMS sent ✅', booking });
  } catch (error) {
    console.error('❌ Error saving booking:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createBooking };
