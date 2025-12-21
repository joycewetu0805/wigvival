import db from '../config/db.js';

/**
 * GET /api/me
 * Récupérer l'utilisateur connecté
 * (version simple sans JWT pour l’instant)
 */
export const getMe = async (req, res) => {
  try {
    // ⚠️ TEMPORAIRE : on prend le dernier utilisateur connecté
    const [[user]] = await db.query(`
      SELECT 
        id,
        role,
        first_name,
        last_name,
        email,
        phone,
        preferences,
        created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 1
    `);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};

/**
 * PUT /api/users/me
 * Mise à jour du profil utilisateur
 */
export const updateMe = async (req, res) => {
  try {
    const { first_name, last_name, phone, preferences } = req.body;

    await db.query(
      `
      UPDATE users
      SET 
        first_name = ?,
        last_name = ?,
        phone = ?,
        preferences = ?,
        updated_at = NOW()
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [
        first_name || null,
        last_name || null,
        phone || null,
        preferences || null,
      ]
    );

    res.json({
      success: true,
      message: 'Profil mis à jour',
    });
  } catch (error) {
    console.error('supdateMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};
