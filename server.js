import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import bookingRoutes from './routes/bookingRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();
const app = express();

mongoose.set('strictQuery', false);

// CORS Configuration
const allowedOrigins = ['https://heavenly-frontend.netlify.app'];
const corsOptions = {
  origin: (origin, callback) => {
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

// Logging Middleware (Optional)
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

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
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.stack);
  });

// Graceful Shutdown (Optional)
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
