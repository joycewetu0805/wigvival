import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Identifiants invalides' });

  delete user.password;
  res.json(user);
};
