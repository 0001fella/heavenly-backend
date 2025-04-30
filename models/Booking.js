const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  date: { type: String, required: true },
  timeFrom: { type: String, required: true },
  timeTo: { type: String, required: true },
  numberOfPeople: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
