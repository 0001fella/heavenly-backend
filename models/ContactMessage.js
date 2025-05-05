import mongoose from 'mongoose';

// Contact Message Schema definition
const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, // Trims whitespace from the string
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true, // Ensures email is stored in lowercase
    validate: {
      validator: function(value) {
        // Basic email validation
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: 'Please provide a valid email address',
    },
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);
