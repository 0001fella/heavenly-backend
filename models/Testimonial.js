import mongoose from 'mongoose';

// Schema for Testimonial
const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

// Model for Testimonial
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
