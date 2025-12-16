import express from 'express';
import * as servicesController from '../controllers/services.controller.js';

const router = express.Router();

/**
 * GET /api/services
 * Public – liste des services
 */
router.get('/', servicesController.getAllServices);

export default router;
