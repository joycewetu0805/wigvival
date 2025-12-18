import db from '../config/db.js';

export const createAppointment = async (req, res) => {
  const {
    user_id,
    stylist_id,
    service_id,
    availability_id,
    appointment_date,
    appointment_time,
    notes
  } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [[slot]] = await conn.query(
      'SELECT * FROM availabilities WHERE id = ? FOR UPDATE',
      [availability_id]
    );

    if (!slot || slot.current_clients >= slot.max_clients) {
      throw new Error('Créneau indisponible');
    }

    const [result] = await conn.query(
      `INSERT INTO appointments
      (user_id, stylist_id, service_id, availability_id, appointment_date, appointment_time, notes)
      VALUES (?,?,?,?,?,?,?)`,
      [user_id, stylist_id, service_id, availability_id, appointment_date, appointment_time, notes]
    );

    await conn.query(
      'UPDATE availabilities SET current_clients = current_clients + 1 WHERE id = ?',
      [availability_id]
    );

    await conn.commit();
    res.status(201).json({ appointment_id: result.insertId });
  } catch (e) {
    await conn.rollback();
    res.status(400).json({ error: e.message });
  } finally {
    conn.release();
  }
};
