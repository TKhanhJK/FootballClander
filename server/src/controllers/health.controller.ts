import { Request, Response } from 'express';
import { bookingRepository } from '../repositories/booking.repository.js';
import { config } from '../config/env.js';

const serverStartTime = Date.now();

export class HealthController {
  async checkHealth(_req: Request, res: Response): Promise<void> {
    try {
      const totalBookings = await bookingRepository.count();
      const uptimeSeconds = Math.floor((Date.now() - serverStartTime) / 1000);

      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${uptimeSeconds}s`,
        service: 'PitchMaster 11 Backend API',
        version: '1.0.0',
        environment: config.nodeEnv,
        database: {
          connected: true,
          type: 'persistent-json-store',
          records: {
            bookings: totalBookings
          }
        },
        memory: {
          rssMb: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
          heapUsedMb: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
        }
      });
    } catch (error) {
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database connection failed'
      });
    }
  }
}

export const healthController = new HealthController();

