import { Router } from 'express';
import { createDepositPayment } from '../controllers/payments.controller.js';

const router = Router();

router.post('/deposit', createDepositPayment);

export default router;
