import express from 'express';
import { createAppointment } from '../controllers/appointments.controller.js';

const router = express.Router();
router.post('/', createAppointment);

export default router;
