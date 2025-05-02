import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
mongoose.set('strictQuery', false);  // or true, depending on the behavior you prefer

import bookingRoutes from './routes/bookingRoutes.js'; // 💥 Add this

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://heavenly-frontend.netlify.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

// 💥 Route
app.use('/api/bookings', bookingRoutes); // 🔥

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 MongoDB connected');
    app.listen(process.env.PORT || 5002, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5002}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB error:', err));
