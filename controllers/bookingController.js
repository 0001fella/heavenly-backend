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

    // Validate required fields
    if (![name, email, phoneNumber, service, date, timeFrom, timeTo, numberOfPeople].every(Boolean)) {
      return res.status(400).json({ message: '⚠️ Missing required booking fields.' });
    }

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

    const clientMessage = `
Hi ${name},

🎶 Your booking is confirmed!

Details:
- Service: ${service}
- Date: ${date}
- Time: ${timeFrom} - ${timeTo}
- People: ${numberOfPeople}

We’ll reach out shortly to confirm any details.

Thanks for choosing Heavenly Rhythms Studio!
    `;

    const adminMessage = `
📥 New Booking Received:

- Name: ${name}
- Email: ${email}
- Phone: ${phoneNumber}
- Service: ${service}
- Date: ${date}
- Time: ${timeFrom} - ${timeTo}
- Guests: ${numberOfPeople}
    `;

    await Promise.all([
      sendEmail({
        to: email,
        subject: '🎧 Your Booking - Heavenly Rhythms Studio',
        text: clientMessage,
      }),
      sendEmail({
        to: process.env.RECIPIENT_EMAIL,
        subject: '📢 New Booking Alert',
        text: adminMessage,
      }),
    ]);

    res.status(201).json({
      message: '✅ Booking created and emails sent.',
      booking,
    });
  } catch (error) {
    console.error('❌ Booking failed:', error.message);
    res.status(500).json({ message: 'Booking failed due to server error.' });
  }
};
