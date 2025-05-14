// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Route imports
import bookingRoutes from './routes/bookingRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();
const app = express();

// --- CORS CONFIG ---
const allowedOrigins = [
  'https://heavenlyrhythms.netlify.app',
  'http://localhost:5002'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// --- MIDDLEWARE ---
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// --- ROUTES ---
app.use('/api/bookings', bookingRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api', contactRoutes); // contact form endpoint

// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('🔥 Unhandled server error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// --- DATABASE CONNECTION ---
const PORT = process.env.PORT || 5002;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

// --- GRACEFUL SHUTDOWN ---
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('🛑 MongoDB connection closed (SIGINT)');
    process.exit(0);
  });
});
