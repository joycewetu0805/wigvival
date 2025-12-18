import db from '../../config/db.js';

export const createStylist = async (req, res) => {
  const { first_name, last_name, title } = req.body;
  await db.query(
    `INSERT INTO stylists (first_name, last_name, title)
     VALUES (?,?,?)`,
    [first_name, last_name, title]
  );
  res.status(201).json({ message: 'Coiffeuse ajoutée' });
};
