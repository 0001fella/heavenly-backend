// models/bookingModel.js

import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Enter a valid email'],
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    match: [/^\+?[0-9\s\-]{7,15}$/, 'Enter a valid phone number'],
  },
  service: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
    match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'],
  },
  timeFrom: {
    type: String,
    required: true,
    match: [/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'],
  },
  timeTo: {
    type: String,
    required: true,
    match: [/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'],
  },
  numberOfPeople: {
    type: Number,
    required: true,
    min: 1,
    max: 50,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Booking', bookingSchema);
