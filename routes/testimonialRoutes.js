// routes/testimonialRoutes.js

import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) {
    console.error("❌ Error fetching testimonials:", err);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

// POST a new testimonial
router.post('/', async (req, res) => {
  const { name, feedback, rating } = req.body;

  if (!name || !feedback || !rating) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newTestimonial = new Testimonial({ name, feedback, rating });
    await newTestimonial.save();
    res.status(201).json({ message: 'Testimonial added successfully' });
  } catch (err) {
    console.error("❌ Error saving testimonial:", err);
    res.status(500).json({ message: 'Failed to save testimonial' });
  }
});

export default router;
