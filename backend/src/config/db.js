import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not configured. Copy .env.example to .env and set it.');

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000
  });
  console.log('MongoDB connected');
}
