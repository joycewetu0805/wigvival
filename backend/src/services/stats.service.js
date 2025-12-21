import db from '../config/db.js';

export const getStatsService = async () => {
  const [[services]] = await db.query('SELECT COUNT(*) as total FROM services');
  return {
    services: services.total,
    categories: 3,
    bookings: 0,
  };
};
