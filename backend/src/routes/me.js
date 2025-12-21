import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

/**
 * GET /api/me?email=
 */
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis',
      });
    }

    const [[user]] = await db.query(
      `SELECT 
        id,
        email,
        phone,
        role,
        created_at
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ /me error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
});

export default router;
