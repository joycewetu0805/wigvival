import db from '../config/db.js';
import bcrypt from 'bcryptjs';

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const emailNormalized = email.toLowerCase().trim();

    const [[existingUser]] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [emailNormalized]
    );

    if (existingUser) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (email, password, first_name, last_name, phone)
       VALUES (?, ?, ?, ?, ?)`,
      [emailNormalized, hashedPassword, firstName, lastName, phone]
    );

    return res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error('REGISTER ERROR:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const emailNormalized = email.toLowerCase().trim();

    const [[user]] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [emailNormalized]
    );

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    delete user.password;
    return res.json(user);
  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};
