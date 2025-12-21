import bcrypt from 'bcryptjs';
import db from '../config/db.js';

/**
 * REGISTER
 */
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis',
      });
    }

    const [[existingUser]] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un compte existe déjà avec cet email',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (email, password_hash, role)
       VALUES (?, ?, ?)`,
      [email, passwordHash, 'client']
    );

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès',
    });

  } catch (error) {
    console.error('❌ register error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l’inscription',
    });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis',
      });
    }

    const [[user]] = await db.query(
      `SELECT id, email, password_hash, role
       FROM users
       WHERE email = ?`,
      [email]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides',
      });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
     if (!isValid) {
    console.log('EMAIL:', email);
    console.log('PASSWORD (clair):', password);
    console.log('HASH DB:', user.password_hash);

      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides',
      });
    }

    delete user.password_hash;

    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    console.error('❌ login error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion',
    });
  }
};
