import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Enter a valid email'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[0-9\s\-]{7,15}$/, 'Enter a valid phone number'],
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    trim: true,
  },
  date: {
    type: String,
    required: [true, 'Booking date is required'],
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
  },
  timeFrom: {
    type: String,
    required: [true, 'Start time is required'],
    match: [/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'],
  },
  timeTo: {
    type: String,
    required: [true, 'End time is required'],
    match: [/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'],
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Number of people is required'],
    min: [1, 'Must be at least 1 person'],
    max: [50, 'Cannot exceed 50 people'],
  },
}, {
  timestamps: true,
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
