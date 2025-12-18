import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  // filters: start, end, stylistId, serviceId
  res.json({ availabilities: [] });
});

export default router;
