import db from '../config/db.js';

const getDepositAmount = async (appointmentId) => {
  const [[settings]] = await db.query(
    'SELECT deposit_percentage FROM settings LIMIT 1'
  );

  const [[appointment]] = await db.query(
    `SELECT s.price FROM appointments a
     JOIN services s ON s.id = a.service_id
     WHERE a.id = ?`,
    [appointmentId]
  );

  return (appointment.price * settings.deposit_percentage) / 100;
};

export default {
  getDepositAmount,
};
