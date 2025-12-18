import dotenv from 'dotenv';
dotenv.config();

const env = {
  env: process.env.NODE_ENV || 'development',

  port: process.env.PORT || 5001,

  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    name: process.env.DB_NAME || 'wigvival_db'
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    expiresIn: '7d'
  },

  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    secret: process.env.PAYPAL_SECRET,
    mode: process.env.PAYPAL_MODE || 'sandbox'
  }
};

export default env;
