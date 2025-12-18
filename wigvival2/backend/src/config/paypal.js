import paypal from '@paypal/checkout-server-sdk';
import env from './env.js';

const environment = env.paypal.mode === 'live'
  ? new paypal.core.LiveEnvironment(env.paypal.clientId, env.paypal.secret)
  : new paypal.core.SandboxEnvironment(env.paypal.clientId, env.paypal.secret);

export const paypalClient = new paypal.core.PayPalHttpClient(environment);
