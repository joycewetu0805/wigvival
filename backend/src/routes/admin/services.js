import { Router } from 'express';

const router = Router();

router.post('/', async (req, res) => {
  res.json({ message: 'Service created' });
});

router.put('/:id', async (req, res) => {
  res.json({ message: 'Service updated' });
});

router.delete('/:id', async (req, res) => {
  res.json({ message: 'Service deleted' });
});

export default router;
