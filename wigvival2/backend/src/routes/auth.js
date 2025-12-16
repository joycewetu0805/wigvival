import { Router } from 'express';

const router = Router();

router.post('/register', async (req, res) => {
  res.json({ message: 'Register endpoint' });
});

router.post('/login', async (req, res) => {
  res.json({ message: 'Login endpoint' });
});

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
