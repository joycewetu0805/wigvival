import { authenticateUser } from '../services/auth.service.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis',
      });
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Identifiants invalides',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ login error:', error.message);

    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion',
    });
  }
};