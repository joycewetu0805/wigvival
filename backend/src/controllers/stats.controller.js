import { getStatsService } from '../services/stats.service.js';

export const getStats = async (req, res) => {
  try {
    const stats = await getStatsService();
    res.json({ success: true, data: stats });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Erreur stats' });
  }
};
