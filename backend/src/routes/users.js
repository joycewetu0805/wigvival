import { Router } from 'express';
import { updateMe } from '../controllers/users.controller.js';

const router = Router();

router.put('/me', updateMe);

export default router;
