import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bookingRoutes from './routes/bookingRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Initialize dotenv and Express
dotenv.config();
const app = express();

// Set mongoose to use the preferred behavior for strict query
mongoose.set('strictQuery', false);

// CORS Configuration
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

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", contactRoutes);  // Contact routes
app.use('/api/bookings', bookingRoutes);  // Booking routes
app.use('/api/testimonials', testimonialRoutes); // Testimonial routes
app.use('/api/comments', commentRoutes); // Comment routes

// MongoDB Connection and Server Setup
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 MongoDB connected');
    app.listen(process.env.PORT || 5002, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5002}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB error:', err));
