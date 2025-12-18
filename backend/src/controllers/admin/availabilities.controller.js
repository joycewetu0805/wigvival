import db from '../../config/db.js';

export const createAvailability = async (req, res) => {
  const { stylist_id, service_id, start_date, end_date, max_clients } = req.body;

  await db.query(
    `INSERT INTO availabilities
    (stylist_id, service_id, start_date, end_date, max_clients)
    VALUES (?,?,?,?,?)`,
    [stylist_id, service_id, start_date, end_date, max_clients]
  );

  res.status(201).json({ message: 'Disponibilité créée' });
};
