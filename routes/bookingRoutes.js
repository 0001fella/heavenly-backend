import express from 'express';
import Booking from '../models/bookingModel.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Setup nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /api/bookings
router.post('/', async (req, res) => {
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

  // Basic validation
  if (!name || !email || !service || !date || !timeFrom || !timeTo) {
    return res.status(400).json({ message: 'Missing required booking fields' });
  }

  try {
    // Save booking to DB
    const booking = new Booking({
      name,
      email,
      phoneNumber,
      service,
      date,
      timeFrom,
      timeTo,
      numberOfPeople
    });

    await booking.save();

    // Try sending emails, but don’t fail the booking if they break
    try {
      // Email to customer
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: '🎶 Booking Confirmed - Heavenly Rhythms Studio',
        text: `Hi ${name},\n\nYour booking is confirmed!\n\n🎧 Service: ${service}\n📅 Date: ${date}\n🕒 Time: ${timeFrom} - ${timeTo}\n\nThanks for booking with Heavenly Rhythms Studio!`,
      });
    } catch (err) {
      console.error('⚠️ Failed to send confirmation email:', err.message);
    }

    try {
      // Email to admin
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL,
        subject: '📥 New Booking Received - Heavenly Rhythms Studio',
        text: `New booking:\nName: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\nService: ${service}\nDate: ${date}\nTime: ${timeFrom} - ${timeTo}\nGuests: ${numberOfPeople}`,
      });
    } catch (err) {
      console.error('⚠️ Failed to notify admin:', err.message);
    }

    return res.status(200).json({
      message: '✅ Booking successful. Confirmation sent.',
      booking
    });

  } catch (error) {
    console.error('❌ Booking Error:', error.message);
    return res.status(500).json({ message: 'Booking failed', error: error.message });
  }
});

export default router;
