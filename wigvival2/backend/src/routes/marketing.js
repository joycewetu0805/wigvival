import { Router } from 'express';

const router = Router();

router.get('/testimonials', async (req, res) => {
  res.json({ testimonials: [] });
});

router.get('/carousel', async (req, res) => {
  res.json({ slides: [] });
});

router.get('/settings', async (req, res) => {
  res.json({ settings: {} });
});

export default router;
