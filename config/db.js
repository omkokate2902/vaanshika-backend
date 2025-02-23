import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      dbName: 'trees',
});

    console.log('✅ Connected to MongoDB');

    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', true);
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); // Exit process on failure
  }
};