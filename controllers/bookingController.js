// controllers/bookingController.js

import Booking from '../models/bookingModel.js';
import sendEmail from '../utils/sendEmail.js';

export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      service,
      date,
      timeFrom,
      timeTo,
      numberOfPeople
    } = req.body;

    // Field validation
    if (![name, email, phoneNumber, service, date, timeFrom, timeTo, numberOfPeople].every(Boolean)) {
      return res.status(400).json({ message: '⚠️ Missing required booking fields.' });
    }

    // Save booking to DB
    const booking = await Booking.create({
      name,
      email,
      phoneNumber,
      service,
      date,
      timeFrom,
      timeTo,
      numberOfPeople,
    });

    // Email content
    const clientMessage = `
Hi ${name},

🎶 Your booking is confirmed!

Booking Details:
- Service: ${service}
- Date: ${date}
- Time: ${timeFrom} - ${timeTo}
- Guests: ${numberOfPeople}

We’ll be in touch soon to finalize everything.

Thanks for choosing Heavenly Rhythms Studio!
    `;

    const adminMessage = `
📥 New Booking Alert:

- Name: ${name}
- Email: ${email}
- Phone: ${phoneNumber}
- Service: ${service}
- Date: ${date}
- Time: ${timeFrom} - ${timeTo}
- Guests: ${numberOfPeople}
    `;

    // Send both emails
    await Promise.all([
      sendEmail({
        to: email,
        subject: '🎧 Your Booking - Heavenly Rhythms Studio',
        text: clientMessage,
      }),
      sendEmail({
        to: process.env.RECIPIENT_EMAIL,
        subject: '📢 New Booking Received',
        text: adminMessage,
      }),
    ]);

    res.status(201).json({
      message: '✅ Booking successful and emails sent.',
      booking,
    });

  } catch (error) {
    console.error('❌ Booking error:', error.message);
    res.status(500).json({
      message: 'Booking failed due to server error.',
      error: error.message,
    });
  }
};
