const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,  // Email should be unique
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  phone: {
    type: String,
    required: true,
    match: [/^\d{10}$/, 'Please enter a valid phone number']  // Ensure a 10-digit phone number
  },
  password: {
    type: String,
    required: true
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  dateJoined: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
