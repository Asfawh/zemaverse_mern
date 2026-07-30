import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbConnect = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI is required');

  try {
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected to MongoDB');
    return mongoose.connection;
  } catch (error) {
    console.error('Database connection failed');
    throw error;
  }
};

export default dbConnect;
