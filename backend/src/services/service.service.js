import db from '../config/db.js';

const getAll = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM services');
    return rows;
  } catch (error) {
    console.error('❌ SERVICES SQL ERROR:', error);
    throw error;
  }
};

export default { getAll };
