import { Router } from 'express';
import {
  getFavorites,
  setReaction,
} from '../controllers/reaction.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/favorites', requireAuth, getFavorites);
router.put('/:songId', requireAuth, setReaction);

export default router;
