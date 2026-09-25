import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { requestLogger } from './middlewares/logger.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import healthRoutes from './routes/health.routes.js';
import pitchRoutes from './routes/pitch.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import aiRoutes from './routes/ai.routes.js';

export function createApp(): Express {
  const app = express();

  // Security & Parsing Middlewares
  app.use(cors({
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id']
  }));
  app.use(express.json());

  // Structured Logging Middleware
  app.use(requestLogger);

  // Mount API Routes under /api prefix
  app.use('/api', healthRoutes);
  app.use('/api', pitchRoutes);
  app.use('/api', bookingRoutes);
  app.use('/api', aiRoutes);

  // 404 Handler for undefined routes
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      statusCode: 404,
      message: `Tài nguyên '${req.method} ${req.originalUrl}' không tồn tại trên hệ thống API PitchMaster 11.`
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
}

export const app = createApp();
