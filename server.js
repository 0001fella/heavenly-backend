// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

// Routes
import bookingRoutes from './routes/bookingRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

dotenv.config();
const app = express();

// --- CORS ---
const allowedOrigins = [
  'https://heavenlyrhythms.netlify.app',
  'http://localhost:5173',
  'http://localhost:5002'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
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
app.use('/api', contactRoutes); // contact endpoint

// --- ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// --- DB CONNECTION ---
const PORT = process.env.PORT || 5002;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// --- CLEAN EXIT ---
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('🛑 MongoDB disconnected via app termination');
    process.exit(0);
  });
});
