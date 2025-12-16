import db from '../config/db.js';
import bcrypt from 'bcryptjs';

export const createUser = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const [result] = await db.query(
    `INSERT INTO users (first_name, last_name, email, phone, password, role)
     VALUES (?,?,?,?,?,?)`,
    [
      data.first_name,
      data.last_name,
      data.email,
      data.phone,
      hashedPassword,
      data.role || 'client'
    ]
  );

  return result.insertId;
};

export const getUserById = async (id) => {
  const [[user]] = await db.query(
    'SELECT id, first_name, last_name, email, phone, role FROM users WHERE id = ?',
    [id]
  );
  return user;
};

export const getUserByEmail = async (email) => {
  const [[user]] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
  );
  return user;
};
