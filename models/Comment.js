// models/Comment.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    eventTitle: { type: String, required: true },  // the event to which the comment belongs
    comment: { type: String, required: true },     // the actual comment
    createdAt: { type: Date, default: Date.now },  // when the comment was created
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
