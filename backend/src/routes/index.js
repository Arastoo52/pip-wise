import { Router } from 'express';
import authRoutes from './auth.routes.js';
import brokerRoutes from './broker.routes.js';
import adminRoutes from './admin.routes.js';
import testimonialRoutes from './testimonial.routes.js';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = Router();

// Health check endpoint for uptime and container health monitors
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const memoryUsage = process.memoryUsage();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        uptime: process.uptime(),
        database: dbStatus,
        timestamp: new Date().toISOString(),
        memory: {
          heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        },
      },
      'PipWise API is healthy and operational'
    )
  );
});

// Mount module routes
router.use('/auth', authRoutes);
router.use('/brokers', brokerRoutes);
router.use('/admin', adminRoutes);
router.use('/testimonials', testimonialRoutes);

export default router;
