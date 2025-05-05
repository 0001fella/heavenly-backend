import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  feedback: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, {
  timestamps: true, // adds createdAt and updatedAt
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
