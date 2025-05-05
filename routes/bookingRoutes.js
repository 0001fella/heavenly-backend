import express from 'express';
import Booking from '../models/bookingModel.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const { name, email, phoneNumber, service, date, timeFrom, timeTo, numberOfPeople } = req.body;

    // Validate basic input (optional: expand later)
    if (!name || !email || !service || !date || !timeFrom || !timeTo) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    // Save booking to database
    const booking = new Booking({ name, email, phoneNumber, service, date, timeFrom, timeTo, numberOfPeople });
    await booking.save();

    // Email to customer
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: '🎶 Booking Confirmed - Heavenly Rhythms Studio',
      text: `Hi ${name}, your booking is confirmed:\n\nService: ${service}\nDate: ${date}\nTime: ${timeFrom} - ${timeTo}\n\nThanks for choosing Heavenly Rhythms!`,
    });

    // Email to admin
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: '📥 New Booking Received - Heavenly Rhythms Studio',
      text: `New booking details:\nName: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\nService: ${service}\nDate: ${date}\nTime: ${timeFrom} - ${timeTo}\nGuests: ${numberOfPeople}`,
    });

    res.status(200).json({ message: '✅ Booking successful and notifications sent' });

  } catch (error) {
    console.error('❌ Booking Error:', error);
    res.status(500).json({ message: 'Booking failed', error: error.message });
  }
});

export default router;
