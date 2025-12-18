import db from '../config/db.js';

export const getHeroSlides = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM hero_slides WHERE is_active = 1 ORDER BY position'
  );
  res.json(rows);
};

export const getTestimonials = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM testimonials WHERE is_active = 1'
  );
  res.json(rows);
};
