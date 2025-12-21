import { Router } from 'express';
import {
  getGallery,
  getGalleryCategories
} from '../controllers/gallery.controller.js';

const router = Router();

router.get('/', getGallery);
router.get('/categories', getGalleryCategories);

export default router;
