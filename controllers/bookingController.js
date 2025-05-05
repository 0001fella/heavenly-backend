// controllers/bookingController.js

import Booking from '../models/bookingModel.js';
import sendEmail from '../utils/sendEmail.js';

export const createBooking = async (req, res) => {
  try {
    const { name, email, phone, date, time, service } = req.body;

    // Input validation
    if (![name, email, phone, date, time, service].every(Boolean)) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    // Save to DB
    const booking = await Booking.create(req.body);

    // Email messages
    const clientMessage = `
      Hello ${name},

      🎶 Thank you for booking with Heavenly Rhythms Studio!

      Booking Details:
      - Service: ${service}
      - Date: ${date}
      - Time: ${time}

      We'll reach out shortly to confirm. Stay blessed 🙏
    `;

    const ownerMessage = `
      📥 New Booking Received:

      - Name: ${name}
      - Email: ${email}
      - Phone: ${phone}
      - Service: ${service}
      - Date: ${date}
      - Time: ${time}
    `;

    // Send emails
    await Promise.all([
      sendEmail(email, '🎧 Your Booking - Heavenly Rhythms Studio', clientMessage),
      sendEmail(process.env.ADMIN_EMAIL, '📢 New Booking Alert', ownerMessage),
    ]);

    res.status(201).json({
      message: '✅ Booking saved and emails sent successfully',
      booking,
    });

  } catch (error) {
    console.error('❌ Booking failed:', error.message);
    res.status(500).json({ message: 'Booking failed due to server error.' });
  }
};
