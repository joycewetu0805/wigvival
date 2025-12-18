import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  res.json({ message: 'Availability created' });
});

router.put('/:id', async (req, res) => {
  res.json({ message: 'Availability updated' });
});

router.delete('/:id', async (req, res) => {
  res.json({ message: 'Availability deleted' });
});

export default router;
