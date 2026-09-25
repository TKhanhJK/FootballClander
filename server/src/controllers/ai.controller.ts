import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { aiService } from '../services/ai.service.js';
import { BadRequestError } from '../types/index.js';

const chatSchema = z.object({
  message: z.string().min(1, 'Nội dung tin nhắn không được để trống').max(2000, 'Tin nhắn quá dài'),
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.string()
    })
  ).optional().default([])
});

export class AIController {
  async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validation = chatSchema.safeParse(req.body);
      if (!validation.success) {
        throw new BadRequestError('Dữ liệu yêu cầu không hợp lệ', validation.error.errors.map(e => e.message));
      }

      const { message, history } = validation.data;
      const result = await aiService.chat(message, history);

      res.status(200).json({
        success: true,
        data: {
          reply: result.reply,
          isAiPowered: result.isAiPowered,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      next(err);
    }
  }
}

export const aiController = new AIController();
