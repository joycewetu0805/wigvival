import { Router } from 'express';
import adminServices from './services.js';
import adminStylists from './stylists.js';
import adminAvailabilities from './availabilities.js';

const router = Router();

router.use('/services', adminServices);
router.use('/stylists', adminStylists);
router.use('/availabilities', adminAvailabilities);

export default router;
