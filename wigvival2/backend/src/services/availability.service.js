import db from '../config/db.js';

export const getAvailableSlots = async (date) => {
  const [rows] = await db.query(
    `SELECT * FROM availabilities
     WHERE DATE(start_date) = ?
     AND current_clients < max_clients`,
    [date]
  );
  return rows;
};
