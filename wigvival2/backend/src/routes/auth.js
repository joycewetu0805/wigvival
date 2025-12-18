import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const router = Router();

/**
 * POST /api/auth/login
 */
router.post('/login', login);

/**
 * (optionnel pour plus tard)
 * Les autres routes seront implémentées ensuite
 */
router.post('/register', (req, res) => {
  res.status(501).json({ message: 'Register not implemented yet' });
});

router.post('/refresh', (req, res) => {
  res.status(501).json({ message: 'Refresh not implemented yet' });
});

router.get('/me', (req, res) => {
  res.status(501).json({ message: 'Me not implemented yet' });
});

router.post('/logout', (req, res) => {
  res.status(501).json({ message: 'Logout not implemented yet' });
});

export default router;
