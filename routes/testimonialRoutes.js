// routes/testimonialRoutes.js

import express from 'express';
import Testimonial from '../models/Testimonial.js';

const router = express.Router();

// GET all testimonials
router.get('/', async (req, res) => {
  try {
    console.log("📥 GET /api/testimonials hit");

    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    console.log("✅ Returning testimonials:", testimonials.length);

    res.status(200).json(testimonials);
  } catch (err) {
    console.error("❌ Error fetching testimonials:", err.message);
    res.status(500).json({ message: 'Failed to fetch testimonials' });
  }
});

// POST a new testimonial
router.post('/', async (req, res) => {
  const { name, feedback, rating } = req.body;

  // Basic validation
  if (!name || !feedback || rating == null) {
    console.warn("⚠️ Missing fields:", { name, feedback, rating });
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newTestimonial = new Testimonial({ name, feedback, rating });
    await newTestimonial.save();

    console.log("✅ New testimonial saved:", newTestimonial._id);
    res.status(201).json({ message: 'Testimonial added successfully' });
  } catch (err) {
    console.error("❌ Error saving testimonial:", err.message);
    res.status(500).json({ message: 'Failed to save testimonial' });
  }
});

export default router;
