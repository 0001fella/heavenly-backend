const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bookingRoutes = require('./routes/bookingRoutes');
const testimonialRoutes = require('./routes/testimonials'); // <-- NOTE: file is named `testimonials.js`
const commentRoutes = require('./routes/commentRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load environment variables
dotenv.config();
const app = express();

// Set mongoose strict query
mongoose.set('strictQuery', false);

// CORS configuration
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

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api', contactRoutes);

// DB connection & server launch
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🟢 MongoDB connected');
    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.stack);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('🔌 MongoDB disconnected');
    process.exit(0);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
