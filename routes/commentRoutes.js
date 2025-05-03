// routes/commentRoutes.js
import express from 'express';
import Comment from '../models/Comment.js';

const router = express.Router();

// POST route to submit a comment
router.post('/', async (req, res) => {
  try {
    const { eventTitle, comment } = req.body;

    // Create a new comment
    const newComment = new Comment({ eventTitle, comment });

    // Save the comment to the database
    await newComment.save();

    res.status(201).json({
      message: 'Comment posted successfully!',
      comment: newComment, // Return the saved comment object
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to post comment', error: err });
  }
});

export default router;
