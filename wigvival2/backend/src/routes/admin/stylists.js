import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  res.json({ message: 'Stylist created' });
});

router.put('/:id', async (req, res) => {
  res.json({ message: 'Stylist updated' });
});

router.delete('/:id', async (req, res) => {
  res.json({ message: 'Stylist deleted' });
});

export default router;
