import { Router } from 'express';
import {
  createSong,
  getOneSong,
  getAllSong,
  updateOneSong,
  deleteOneSong,
  searchSong,
} from '../controllers/song.controller.js';
import { optionalAuth, requireEditor } from '../middleware/auth.middleware.js';

const router = Router();

router.route('/').get(optionalAuth, getAllSong).post(createSong);

// router.route('/search').get(searchSong);
router
  .route('/:id')
  .get(optionalAuth, getOneSong)
  .put(requireEditor, updateOneSong)
  .delete(requireEditor, deleteOneSong);

export default router;
