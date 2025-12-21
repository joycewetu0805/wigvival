import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const authenticateUser = async (email, password) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        id,
        email,
        password,
        role,
        created_at
      FROM users
      WHERE email = ?
      `,
      [email]
    );

    if (!rows || rows.length === 0) {
      return null;
    }

    const user = rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    delete user.password;
    return user;
  } catch (error) {
    console.error('❌ authenticateUser error:', error.message);
    throw error;
  }
};
