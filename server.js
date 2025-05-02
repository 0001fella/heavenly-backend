import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import africastalking from 'africastalking';
import cors from 'cors';

dotenv.config();

const app = express();

// CORS configuration: Allow requests from Netlify frontend
const allowedOrigins = [
  'https://heavenly-frontend.netlify.app', // Use your actual Netlify frontend URL here
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions)); // Apply CORS with the specific origin
app.use(express.json());

// Initialize Africa's Talking
const at = africastalking({
  apiKey: process.env.AT_API_KEY,      // Your Africa's Talking API key
  username: process.env.AT_USERNAME,   // Use 'sandbox' for testing
});

const sms = at.SMS;

// Initialize Nodemailer for email functionality
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or use your email provider (e.g., SendGrid, Mailgun)
  auth: {
    user: process.env.SMTP_USER,  // Your email address
    pass: process.env.SMTP_PASS,  // Your email password or app-specific password
  },
});

// Function to send SMS using Africa's Talking
const sendSmsConfirmation = async (phoneNumber) => {
  try {
    const response = await sms.send({
      to: [phoneNumber],
      message: '✅ Heavenly Rhythms: Your booking request has been received. We will contact you shortly. 🎶',
      from: process.env.AT_SENDER_ID || '', // Optional: Your registered sender ID
    });
    console.log('📩 SMS sent:', response);
  } catch (error) {
    console.error('❌ SMS Error:', error);
  }
};

// Function to send email notification for contact form submission
const sendEmailConfirmation = async (contactInfo) => {
  const { name, email, message } = contactInfo;

  const mailOptions = {
    from: process.env.SMTP_USER,  // Your email address
    to: process.env.CONTACT_EMAIL,  // The email address to receive contact form submissions
    subject: `New Contact Message from ${name}`,
    text: `
      You have received a new message from ${name} (${email}):
      
      Message:
      ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent:', mailOptions);
  } catch (error) {
    console.error('❌ Email Error:', error);
  }
};

// Route to handle booking and send SMS confirmation
app.post('/book', async (req, res) => {
  const { phoneNumber, name } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'phoneNumber is required.' });
  }

  try {
    // Send SMS confirmation after booking request
    const message = `Hi ${name || 'Customer'}, your booking at Heavenly Rhythms Studio was successful. See you soon! 🎶`;
    await sendSmsConfirmation(phoneNumber);

    res.status(200).json({
      message: 'Booking received and SMS sent ✅',
    });
  } catch (error) {
    console.error('❌ Error handling booking:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Route to handle contact form submissions
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields (name, email, and message) are required.' });
  }

  try {
    // Send email confirmation
    await sendEmailConfirmation({ name, email, message });
    
    // Respond to the frontend
    res.status(200).json({ message: 'Your message has been received! We will get back to you soon.' });
  } catch (error) {
    console.error('❌ Error handling contact form:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
