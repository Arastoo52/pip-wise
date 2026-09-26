import app from './src/app.js';
import connectDB from './src/config/db.js';
import config from './src/config/config.js';
import { seedAdminAndReviews } from './src/utils/seedAdmin.js';

let server;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down gracefully...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Initialize database connection and start HTTP server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Ensure Admin account and initial reviews exist
    await seedAdminAndReviews();

    // Start listening for incoming requests
    server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`🚀 PipWise Backend running in ${config.env.toUpperCase()} mode`);
      console.log(`📡 Server listening at: http://localhost:${config.port}`);
      console.log(`🩺 Health check URL: http://localhost:${config.port}/api/v1/health`);
      console.log(`🔐 Auth API Base: http://localhost:${config.port}/api/v1/auth`);
      console.log(`👑 Admin API Base: http://localhost:${config.port}/api/v1/admin`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Closing server...');
  console.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM (e.g. from Docker, Kubernetes, or hosting platform)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('💤 Process terminated cleanly.');
    });
  }
});

// Handle SIGINT (e.g. Ctrl + C in terminal)
process.on('SIGINT', () => {
  console.log('👋 SIGINT received. Shutting down gracefully...');
  if (server) {
    server.close(() => {
      console.log('💤 Process terminated cleanly.');
      process.exit(0);
    });
  }
});
