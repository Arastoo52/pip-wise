import mongoose from 'mongoose';
import config from './config.js';

/**
 * High-Performance MongoDB Connection with Connection Pooling
 * Optimized for high concurrency (5,000+ users)
 */
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(config.mongoUri, {
      maxPoolSize: 50,          // Maintain up to 50 active socket connections
      minPoolSize: 10,          // Keep at least 10 sockets open for instant query response
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: config.env !== 'production', // Build indexes in dev, prevent blocking in prod
    });

    console.log(`✅ MongoDB Connected! Host: ${connectionInstance.connection.host}`);
    console.log(`📦 Database: ${connectionInstance.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected. Attempting to reconnect...');
    });

    return connectionInstance;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
