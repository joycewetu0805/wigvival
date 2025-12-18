import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.post('/refresh', async (req, res) => {
  res.json({ message: 'Refresh token' });
});

router.get('/me', async (req, res) => {
  res.json({ message: 'Current user' });
});

router.post('/logout', async (req, res) => {
  res.json({ message: 'Logout' });
});

export default router;
