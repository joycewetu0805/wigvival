import db from '../config/db.js';

export const getStylists = async (req, res) => {
  const [stylists] = await db.query(
    'SELECT * FROM stylists WHERE is_active = 1'
  );
  res.json(stylists);
};
