import { Router } from 'express';
import { pitchController } from '../controllers/pitch.controller.js';

const router = Router();

router.get('/pitches', (req, res, next) => pitchController.getPitches(req, res, next));
router.get('/pitches/:id', (req, res, next) => pitchController.getPitchById(req, res, next));
router.get('/time-slots', (req, res, next) => pitchController.getTimeSlots(req, res, next));
router.get('/addons', (req, res, next) => pitchController.getAddons(req, res, next));

export default router;

