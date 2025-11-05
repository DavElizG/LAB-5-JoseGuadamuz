
// =============================
// 🧠 Servidor con monitoreo Sentry
// =============================
// Imports
const express = require('express');
const session = require('express-session');
const ExpressOIDC = require('@okta/oidc-middleware').ExpressOIDC;
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const cons = require('consolidate');
const path = require('path');
const app = express();

// Load environment variables from .env
require('dotenv').config();

// --- SENTRY MONITOREO ---

// --- SENTRY MONITOREO (versión v7 estable) ---
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  environment: process.env.SENTRY_ENV || 'development',
  integrations: [
    nodeProfilingIntegration(), // Solo esta integración
  ],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});



app.use(setupExpressRequestHandler());


// Globals (loaded from environment)
const PORT = process.env.PORT || '3000';
const SECRET = process.env.SECRET || 'a_long_default_dev_secret_change_me';
// Use BASE_URL consistently; required by some OIDC libraries as appBaseUrl
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OKTA_ISSUER_URI = process.env.ISSUER_BASE_URL || 'https://una-infosec.us.auth0.com/';
const OKTA_CLIENT_ID = process.env.CLIENT_ID || 'mlIokKRjb5CGf8FbKpDIOKE36e7BjDLA';
const OKTA_CLIENT_SECRET = process.env.CLIENT_SECRET || 'replace-with-env-secret';
const REDIRECT_URI = process.env.REDIRECT_URI || `${BASE_URL}/dashboard`;

//  Auth configuration (uses express-openid-connect). Secrets/IDs come from env.
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: SECRET,
  baseURL: BASE_URL,
  clientID: OKTA_CLIENT_ID,
  issuerBaseURL: OKTA_ISSUER_URI
};

// Provide appBaseUrl to satisfy @okta/oidc-middleware configuration validation
const oidc = new ExpressOIDC({
  issuer: OKTA_ISSUER_URI,
  client_id: OKTA_CLIENT_ID,
  client_secret: OKTA_CLIENT_SECRET,
  redirect_uri: REDIRECT_URI,
  appBaseUrl: BASE_URL,
  routes: { callback: { defaultRedirect: REDIRECT_URI } },
  scope: 'openid profile'
});

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));
// --- Middlewares de Sentry (captura de requests y trazas) ---
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// MVC View Setup
app.engine('html', cons.swig);
app.set('views', path.join(__dirname, 'views'));
app.set('models', path.join(__dirname, 'models'));
app.set('view engine', 'html');

// Security middleware
app.disable('x-powered-by'); // Disable X-Powered-By header

// App middleware
app.use('/static', express.static('static'));

app.use(session({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production
    sameSite: 'strict' // Protect against CSRF
  },
  secret: SECRET,
  resave: false,
  saveUninitialized: false
}));

// --- Manejador de errores global de Sentry ---
app.use(errorHandler);

// App routes
app.use(oidc.router);

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/dashboard', requiresAuth(), (req, res) => {
  // if(req.oidc.isAuthenticated())
  // {
  const payload = Buffer.from(req.appSession.id_token.split('.')[1], 'base64').toString('utf-8');
  const userInfo = JSON.parse(payload);
  res.render('dashboard', { user: userInfo });
  //}
});

const openIdClient = require('openid-client');
// Set default HTTP options if they exist
if (openIdClient.Issuer.defaultHttpOptions) {
  openIdClient.Issuer.defaultHttpOptions.timeout = 20000;
}
// --- Rutas de prueba y error ---
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

app.get('/demo-error', (req, res, next) => {
  try {
    throw new Error('Error de demostración: prueba de integración Sentry');
  } catch (err) {
    next(err);
  }
});



// Rutas de prueba para Sentry
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, ts: Date.now() });
});

app.get('/demo-error', (req, res, next) => {
  try {
    throw new Error('Error de demostración: integración Sentry activa.');
  } catch (err) {
    next(err);
  }
});


// --- Manejador global de errores con Sentry ---
app.use(Sentry.Handlers.errorHandler());




oidc.on('ready', () => {
  // eslint-disable-next-line no-console
  console.log('Server running on port: ' + PORT);
  app.listen(parseInt(PORT));
});

oidc.on('error', err => {
  // eslint-disable-next-line no-console
  console.error(err);
});

app.get('/demo-error', (req, res) => {
  throw new Error('Error de prueba para Sentry - Seguridad Informática');
});
