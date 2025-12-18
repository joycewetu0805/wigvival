import app from './app.js';
import config from './config/index.js';
import db from './config/db.js';

const PORT = config.port;

const startServer = async () => {
  try {
    await db.query('SELECT 1');
    console.log('✅ MySQL connecté');

    app.listen(PORT, () => {
      console.log(`🚀 API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Erreur MySQL:', err.message);
    process.exit(1);
  }
};

startServer();
