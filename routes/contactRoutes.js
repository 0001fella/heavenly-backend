// routes/contactRoutes.js

import express from 'express';
import { sendMessage } from '../controllers/contactController.js';

const router = express.Router();

// POST route for handling contact form submission
router.post('/contact', sendMessage);

export default router;
