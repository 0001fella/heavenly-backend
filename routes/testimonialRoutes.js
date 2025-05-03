// routes/testimonialRoutes.js
import express from 'express';
import { createTestimonial, getTestimonials } from '../controllers/testimonialController.js';

const router = express.Router();

// Route for submitting a testimonial
router.post('/submit', createTestimonial);

// Route for getting all testimonials
router.get('/', getTestimonials);

export default router;
