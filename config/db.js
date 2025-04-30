import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Load .env file

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
