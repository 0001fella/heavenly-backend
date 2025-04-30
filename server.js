import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import cors from 'cors';
import africastalking from 'africastalking';

dotenv.config();

const app = express();

// CORS configuration: Allow requests from Netlify frontend
const allowedOrigins = [
  'https://your-frontend-name.netlify.app', // Add your actual Netlify URL here
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

// Function to send SMS using Africa's Talking
const sendSmsConfirmation = async (phoneNumber) => {
  try {
    const response = await sms.send({
      to: [phoneNumber],
      message: '✅ Heavenly Rhythms: Your booking and payment request has been received. We will contact you shortly.',
      from: process.env.AT_SENDER_ID || '', // Optional: Your registered sender ID
    });
    console.log('📩 SMS sent:', response);
  } catch (error) {
    console.error('❌ SMS Error:', error);
  }
};

// Function to initiate M-PESA STK Push
const initiatePayment = async (phoneNumber, amount, res) => {
  const url = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';

  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const password = Buffer.from(
    `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  const headers = {
    Authorization: `Bearer ${process.env.MPESA_LIPA_NGAPI}`,
    'Content-Type': 'application/json',
  };

  const payload = {
    BusinessShortCode: process.env.MPESA_SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: process.env.MPESA_SHORTCODE,
    PhoneNumber: phoneNumber,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: 'HeavenlyRhythmsBooking',
    TransactionDesc: 'Heavenly Rhythms Studio Booking Payment',
  };

  try {
    const response = await axios.post(url, payload, { headers });
    console.log('✅ STK Push Response:', response.data);

    // Send SMS confirmation after successful STK Push request
    await sendSmsConfirmation(phoneNumber);

    res.status(200).json(response.data);
  } catch (error) {
    console.error('❌ STK Push Error:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to initiate STK Push',
      error: error.response?.data || error.message,
    });
  }
};

// Route to trigger payment
app.post('/pay', async (req, res) => {
  const { phoneNumber, amount } = req.body;

  if (!phoneNumber || !amount) {
    return res.status(400).json({ message: 'phoneNumber and amount are required.' });
  }

  initiatePayment(phoneNumber, amount, res);
});

// Callback for M-PESA (optional)
app.post('/callback', (req, res) => {
  console.log('🔁 M-PESA Callback received:', req.body);
  res.status(200).json({ message: 'Callback received successfully' });
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
