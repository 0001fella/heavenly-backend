// controllers/testimonialController.js
import Testimonial from '../models/testimonialModel.js';

// Handle POST request for creating a testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { name, feedback, rating } = req.body;

    // Create a new testimonial
    const testimonial = await Testimonial.create({ name, feedback, rating });

    res.status(201).json({
      message: 'Testimonial submitted successfully.',
      testimonial,
    });
  } catch (error) {
    console.error('❌ Error saving testimonial:', error);
    res.status(500).json({
      message: 'Failed to save testimonial.',
      error,
    });
  }
};

// Handle GET request to fetch all testimonials
export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }); // Most recent first

    res.status(200).json(testimonials);
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    res.status(500).json({
      message: 'Failed to fetch testimonials.',
      error,
    });
  }
};
