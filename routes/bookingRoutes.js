import express from 'express';
import Booking from '../models/bookingModel.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Setup nodemailer transporter
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
    // Save to DB
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
    console.log(`✅ Booking saved for ${name}`);

    // Send confirmation email to client
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: '🎶 Booking Confirmed - Heavenly Rhythms Studio',
        text: `Hi ${name},\n\nYour booking is confirmed!\n\n🎧 Service: ${service}\n📅 Date: ${date}\n🕒 Time: ${timeFrom} - ${timeTo}\n\nThanks for booking with Heavenly Rhythms Studio!`,
      });
      console.log(`📧 Confirmation sent to ${email}`);
    } catch (emailErr) {
      console.warn(`⚠️ Email to client failed: ${emailErr.message}`);
    }

    // Notify studio/admin
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL,
        subject: '📥 New Booking Received - Heavenly Rhythms Studio',
        text: `New booking:\nName: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\nService: ${service}\nDate: ${date}\nTime: ${timeFrom} - ${timeTo}\nGuests: ${numberOfPeople}`,
      });
      console.log(`📧 Admin notified at ${process.env.CONTACT_EMAIL}`);
    } catch (adminErr) {
      console.warn(`⚠️ Email to admin failed: ${adminErr.message}`);
    }

    res.status(200).json({
      message: '✅ Booking saved and emails attempted.',
      booking
    });

  } catch (err) {
    console.error('❌ Booking Error:', err.message);
    res.status(500).json({ message: 'Booking failed. Please try again.', error: err.message });
  }
});

// Optional: handle OPTIONS preflight (some hosts require it)
router.options('/', (req, res) => {
  res.sendStatus(204); // No Content
});

export default router;
