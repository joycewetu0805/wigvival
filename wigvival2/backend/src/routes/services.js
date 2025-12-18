import express from 'express';
import { getAllServices } from '../controllers/services.controller.js';

const router = express.Router();

/**
 * GET /api/services
 * Public – liste des services
 */
router.get('/', getAllServices);

export default router;
