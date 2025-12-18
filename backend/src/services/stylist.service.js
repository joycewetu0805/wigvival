import db from '../config/db.js';

export const listStylists = async () => {
  const [rows] = await db.query(
    'SELECT * FROM stylists WHERE is_active = 1'
  );
  return rows;
};

export const getStylistById = async (id) => {
  const [[stylist]] = await db.query(
    'SELECT * FROM stylists WHERE id = ?',
    [id]
  );
  return stylist;
};

export const createStylist = async (data) => {
  const [result] = await db.query(
    `INSERT INTO stylists
     (first_name, last_name, title, bio, experience, rating)
     VALUES (?,?,?,?,?,?)`,
    [
      data.first_name,
      data.last_name,
      data.title,
      data.bio,
      data.experience,
      data.rating || 5
    ]
  );

  return result.insertId;
};
