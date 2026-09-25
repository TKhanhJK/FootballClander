import { Router } from 'express';
import { aiController } from '../controllers/ai.controller.js';

const router = Router();

router.post('/ai/chat', (req, res, next) => aiController.chat(req, res, next));

export default router;
