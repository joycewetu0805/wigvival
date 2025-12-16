import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const authenticateUser = async (email, password) => {
  const [[user]] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );

  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  delete user.password;
  return user;
};
