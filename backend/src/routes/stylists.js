import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ stylists: [] });
});

router.get('/:id', async (req, res) => {
  res.json({ stylistId: req.params.id });
});

export default router;
