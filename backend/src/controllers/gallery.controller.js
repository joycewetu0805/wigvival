import db from '../config/db.js';

/**
 * GET /api/gallery
 */
export const getGallery = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        title,
        image,
        category
      FROM gallery
      ORDER BY id DESC
    `);

    res.status(200).json(rows);
  } catch (error) {
    console.error('getGallery error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement de la galerie',
    });
  }
};

/**
 * GET /api/gallery/categories
 */
export const getGalleryCategories = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT category
      FROM gallery
      ORDER BY category ASC
    `);

    res.status(200).json(rows.map(r => r.category));
  } catch (error) {
    console.error('getGalleryCategories error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du chargement des catégories',
    });
  }
};
