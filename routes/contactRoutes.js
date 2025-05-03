import express from 'express';
import { sendMessage } from '../controllers/contactController.js';

const router = express.Router();

// Route for handling contact form submissions
router.post('/', sendMessage);

export default router;  // Ensure this is a default export
