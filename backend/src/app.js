import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/index.js';
import corsConfig from './config/cors.js';

/* ----------- ROUTES ----------- */
import publicRoutes from './routes/public.js';
import authRoutes from './routes/auth.js';
import serviceRoutes from './routes/services.js';
import stylistRoutes from './routes/stylists.js';
import availabilityRoutes from './routes/availabilities.js';
import appointmentRoutes from './routes/appointments.js';
import paymentRoutes from './routes/payments.js';
import uploadRoutes from './routes/uploads.js';
import marketingRoutes from './routes/marketing.js';
import galleryRoutes from './routes/gallery.js';
import statsRoutes from './routes/stats.js';
import meRoutes from './routes/me.js';
import usersRoutes from './routes/users.js';


/* ----------- ADMIN ROUTES ----------- */
import adminRoutes from './routes/admin/index.js';
import adminServiceRoutes from './routes/admin/services.js';

/* ----------- MIDDLEWARES ----------- */
import errorHandler from './middlewares/errorHandler.js';

const app = express();

/* ================== MIDDLEWARES GLOBAUX ================== */
app.use(cors(corsConfig));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

/* ================== ROOT ================== */
app.get('/', (req, res) => {
  res.json({
    message: 'WIGVIVAL API is running',
    env: config.env,
  });
});

/* ================== HEALTH CHECK ================== */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    env: config.env,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ================== ROUTES PUBLIQUES ================== */
app.use('/api', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/stylists', stylistRoutes);
app.use('/api/availabilities', availabilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/me', meRoutes);
app.use('/api/users', usersRoutes);

/* ================== ROUTES ADMIN ================== */
app.use('/api/admin', adminRoutes);
app.use('/api/admin/services', adminServiceRoutes);

/* ================== 404 ================== */
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
  });
});

/* ================== ERROR HANDLER GLOBAL ================== */
app.use(errorHandler);

export default app;
