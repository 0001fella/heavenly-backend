import mongoose from 'mongoose';

// Booking Schema definition
const bookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
  },
  date: {
    type: String,
    required: [true, 'Booking date is required'],
  },
  timeFrom: {
    type: String,
    required: [true, 'Start time is required'],
  },
  timeTo: {
    type: String,
    required: [true, 'End time is required'],
  },
  numberOfPeople: {
    type: Number,
    required: [true, 'Number of people is required'],
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
