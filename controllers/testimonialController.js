import Testimonial from '../models/Testimonial.js';

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json(testimonials);
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
};

export const createTestimonial = async (req, res) => {
  const { name, feedback, rating } = req.body;

  if (!name || !feedback || rating == null) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newTestimonial = new Testimonial({ name, feedback, rating });
    await newTestimonial.save();
    res.status(201).json({ message: 'Testimonial added successfully', testimonial: newTestimonial });
  } catch (err) {
    console.error('Error saving testimonial:', err);
    res.status(500).json({ message: 'Failed to save testimonial' });
  }
};
