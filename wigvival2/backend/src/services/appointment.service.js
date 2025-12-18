import db from '../config/db.js';

export const createAppointment = async (data) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [[slot]] = await conn.query(
      'SELECT * FROM availabilities WHERE id = ? FOR UPDATE',
      [data.availability_id]
    );

    if (!slot || slot.current_clients >= slot.max_clients) {
      throw new Error('Créneau complet');
    }

    const [result] = await conn.query(
      `INSERT INTO appointments
       (user_id, stylist_id, service_id, availability_id, appointment_date, appointment_time, notes)
       VALUES (?,?,?,?,?,?,?)`,
      [
        data.user_id,
        data.stylist_id,
        data.service_id,
        data.availability_id,
        data.appointment_date,
        data.appointment_time,
        data.notes
      ]
    );

    await conn.query(
      'UPDATE availabilities SET current_clients = current_clients + 1 WHERE id = ?',
      [data.availability_id]
    );

    await conn.commit();
    return result.insertId;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
};
