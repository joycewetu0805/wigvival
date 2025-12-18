import db from '../config/db.js';

const getAll = async () => {
  try {
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
      ORDER BY id DESC
    `);

    return rows;
  } catch (error) {
    console.error('❌ Service getAll error:', error.message);
    throw error;
  }
};

export default {
  getAll,
};
