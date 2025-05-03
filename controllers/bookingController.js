import Booking from '../models/bookingModel.js';
import sendEmail from '../utils/sendEmail.js'; // Make sure this utility exists

export const createBooking = async (req, res) => {
  const { name, email, phone, date, time, service } = req.body;

  // 1. Validate input
  if (!name || !email || !phone || !date || !time || !service) {
    return res.status(400).json({ message: 'Please fill in all required fields.' });
  }

  try {
    // 2. Save to database
    const booking = await Booking.create(req.body);

    // 3. Send confirmation emails
    const clientMessage = `
      Hello ${name},\n
      Thank you for booking with Heavenly Rhythms Studio! 🎶\n
      Details:\n
      - Service: ${service}\n
      - Date: ${date}\n
      - Time: ${time}\n
      We will contact you shortly to confirm.\n
      Blessings 🙏
    `;

    const ownerMessage = `
      📢 New Booking Alert:\n
      - Name: ${name}\n
      - Email: ${email}\n
      - Phone: ${phone}\n
      - Service: ${service}\n
      - Date: ${date}\n
      - Time: ${time}
    `;

    await sendEmail(email, 'Your Booking at Heavenly Rhythms 🎧', clientMessage);
    await sendEmail(process.env.ADMIN_EMAIL, '📥 New Booking Received', ownerMessage);

    res.status(201).json({
      message: 'Booking saved successfully and emails sent ✅',
      booking,
    });
  } catch (error) {
    console.error('❌ Booking failed:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
