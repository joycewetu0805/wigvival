import db from '../config/db.js';

export const getAvailabilities = async (req, res) => {
  const { date } = req.query;

  const [rows] = await db.query(
    `SELECT * FROM availabilities
     WHERE DATE(start_date) = ?
     AND current_clients < max_clients`,
    [date]
  );

  res.json(rows);
};
