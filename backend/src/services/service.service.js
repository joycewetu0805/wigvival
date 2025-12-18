import db from '../config/db.js';

const getAll = async () => {
  const [rows] = await db.query(`
    SELECT 
      id,
      name,
      description,
      price,
      duration,
      category,
      is_featured
    FROM services
    WHERE is_active = 1
    ORDER BY position ASC
  `);
  return rows;
};

export default {
  getAll,
};
