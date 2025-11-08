/**
 * Auth0 Configuration Module
 * @module config/auth0.config
 * @description Configuración centralizada de Auth0 para autenticación segura
 * 
 * @security
 * - Todas las credenciales sensibles se cargan desde variables de entorno
 * - No exponer secretos en el código fuente
 * - Validar que todas las variables requeridas estén presentes
 */

require('dotenv').config();

/**
 * Valida que todas las variables de entorno requeridas estén configuradas
 * @throws {Error} Si falta alguna variable requerida
 */
function validateAuth0Config() {
  const requiredVars = [
    'AUTH0_DOMAIN',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_CALLBACK_URL',
    'SESSION_SECRET'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `[AUTH0 CONFIG ERROR] Faltan variables de entorno requeridas: ${missingVars.join(', ')}\n` +
      'Por favor, configura estas variables en tu archivo .env'
    );
  }
}

// Validar configuración al cargar el módulo
validateAuth0Config();

/**
 * Configuración de Auth0
 * @type {Object}
 */
const auth0Config = {
  // Auth0 Domain
  authorizationParams: {
    response_type: 'code',
    scope: 'openid profile email'
  },
  
  // Auth0 Domain
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  
  // Auth0 Client ID
  clientID: process.env.AUTH0_CLIENT_ID,
  
  // Auth0 Client Secret
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  
  // URL base de la aplicación
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  
  // Secret para sesiones (debe ser un string aleatorio largo y complejo)
  secret: process.env.SESSION_SECRET,
  
  // Configuración de express-openid-connect
  authRequired: false, // No requerir autenticación para todas las rutas
  auth0Logout: true, // Cerrar sesión también en Auth0
  
  // Configuración de sesión simplificada
  session: {
    cookie: {
      sameSite: 'Lax'
    }
  }
};

/**
 * Configuración de Passport Auth0 Strategy
 * @type {Object}
 */
const passportConfig = {
  domain: process.env.AUTH0_DOMAIN,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  scope: 'openid profile email'
};

/**
 * Middleware para verificar si el usuario está autenticado
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 * @returns {void}
 */
function requireAuth(req, res, next) {
  if (!req.oidc || !req.oidc.isAuthenticated()) {
    return res.status(401).json({ 
      error: 'No autorizado',
      message: 'Debes iniciar sesión para acceder a este recurso' 
    });
  }
  next();
}

/**
 * Middleware para Socket.IO - Verificar autenticación
 * @param {Object} socket - Socket.IO socket
 * @param {Function} next - Next middleware
 * @returns {void}
 */
function requireSocketAuth(socket, next) {
  const session = socket.request.session;
  
  if (!session || !session.user) {
    const err = new Error('No autorizado - Debes iniciar sesión');
    err.data = { content: 'Por favor, inicia sesión para usar el chat' };
    return next(err);
  }
  
  // Adjuntar información del usuario al socket
  socket.user = session.user;
  next();
}

/**
 * Obtener información del usuario desde la sesión
 * @param {Object} req - Express request
 * @returns {Object|null} User information or null
 */
function getUserInfo(req) {
  if (req.oidc && req.oidc.isAuthenticated()) {
    return req.oidc.user;
  }
  return null;
}

module.exports = {
  auth0Config,
  passportConfig,
  requireAuth,
  requireSocketAuth,
  getUserInfo,
  validateAuth0Config
};
