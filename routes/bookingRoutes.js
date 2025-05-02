import express from 'express';
import Booking from '../models/bookingModel.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Email setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Booking endpoint
router.post('/', async (req, res) => {
  const bookingData = req.body;

  try {
    // 1. Save to DB
    const booking = new Booking(bookingData);
    await booking.save();

    // 2. Send email to customer
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: booking.email,
      subject: '🎶 Booking Confirmed - Heavenly Rhythms Studio',
      text: `Hi ${booking.name}, your booking has been confirmed.\n\nDetails:\nService: ${booking.service}\nDate: ${booking.date}\nTime: ${booking.timeFrom} - ${booking.timeTo}\n\nThank you for choosing us!`,
    });

    // 3. Send email to owner
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL, // your studio/admin email
      subject: '📥 New Booking Alert - Heavenly Rhythms Studio',
      text: `New booking by ${booking.name}.\n\nEmail: ${booking.email}\nPhone: ${booking.phoneNumber}\nService: ${booking.service}\nDate: ${booking.date}\nTime: ${booking.timeFrom} - ${booking.timeTo}\nPeople: ${booking.numberOfPeople}`,
    });

    res.status(200).json({ message: '✅ Booking successful and emails sent' });
  } catch (error) {
    console.error('❌ Booking Error:', error);
    res.status(500).json({ message: 'Booking failed', error });
  }
});

export default router;
