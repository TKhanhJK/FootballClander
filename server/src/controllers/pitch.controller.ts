import { Request, Response, NextFunction } from 'express';
import { pitchService } from '../services/pitch.service.js';

export class PitchController {
  async getPitches(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pitches = await pitchService.getPitches();
      res.status(200).json({
        success: true,
        data: pitches,
        total: pitches.length
      });
    } catch (err) {
      next(err);
    }
  }

  async getPitchById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pitch = await pitchService.getPitchById(req.params.id);
      res.status(200).json({
        success: true,
        data: pitch
      });
    } catch (err) {
      next(err);
    }
  }

  async getTimeSlots(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const slots = await pitchService.getTimeSlots();
      res.status(200).json({
        success: true,
        data: slots
      });
    } catch (err) {
      next(err);
    }
  }

  async getAddons(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const addons = await pitchService.getAddons();
      res.status(200).json({
        success: true,
        data: addons
      });
    } catch (err) {
      next(err);
    }
  }
}

export const pitchController = new PitchController();

