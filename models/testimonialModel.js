// models/testimonialModel.js
import mongoose from 'mongoose';

// Define the testimonial schema
const testimonialSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create the model based on the schema
const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
