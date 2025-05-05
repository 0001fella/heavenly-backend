// controllers/testimonialController.js
import Testimonial from '../models/testimonialModel.js';

// Handle POST request for creating a testimonial
export const createTestimonial = async (req, res) => {
  try {
    const { name, feedback, rating } = req.body;

    // Validate input fields
    if (![name, feedback, rating].every(Boolean)) {
      return res.status(400).json({ message: 'All fields (name, feedback, rating) are required.' });
    }

    // Create a new testimonial
    const testimonial = await Testimonial.create({ name, feedback, rating });

    // Send success response
    res.status(201).json({
      message: 'Testimonial submitted successfully.',
      testimonial,
    });
  } catch (error) {
    console.error('❌ Error saving testimonial:', error);
    res.status(500).json({
      message: 'Failed to save testimonial. Please try again later.',
      error: error.message, // Provide more details in error message
    });
  }
};

// Handle GET request to fetch all testimonials
export const getTestimonials = async (req, res) => {
  try {
    // Fetch testimonials sorted by most recent first
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    // Send the testimonials back to the client
    res.status(200).json(testimonials);
  } catch (error) {
    console.error('❌ Error fetching testimonials:', error);
    res.status(500).json({
      message: 'Failed to fetch testimonials. Please try again later.',
      error: error.message, // Provide error details
    });
  }
};
