/**
 * Authentication Middleware
 * @module middleware/auth.middleware
 * @description Middleware de autenticación para proteger rutas y sockets
 * 
 * @security
 * - Validación de sesiones activas
 * - Protección de rutas sensibles
 * - Autenticación de conexiones Socket.IO
 */

const { auth } = require('express-openid-connect');
const { auth0Config } = require('../config/auth0.config');

/**
 * Middleware de autenticación de Auth0
 * Configura express-openid-connect con Auth0
 */
const authMiddleware = auth(auth0Config);

/**
 * Middleware para verificar si el usuario está autenticado
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 * @returns {void}
 */
function requireAuth(req, res, next) {
  if (!req.oidc?.isAuthenticated()) {
    // Redirigir al login en lugar de devolver JSON
    return res.redirect('/login');
  }
  next();
}

/**
 * Middleware para Socket.IO - Verificar autenticación desde sesión
 * @returns {Function} Middleware function
 */
function socketAuthMiddleware() {
  return (socket, next) => {
    const session = socket.request.session;
    
    // Verificar si hay sesión activa
    if (!session) {
      const err = new Error('No hay sesión activa');
      err.data = { 
        content: 'Por favor, recarga la página e inicia sesión',
        type: 'session_error'
      };
      return next(err);
    }

    // Verificar si hay usuario autenticado en la sesión
    // Auth0 guarda el usuario en diferentes lugares según configuración
    const user = session.user || 
                 session.passport?.user ||
                 session.openidTokens?.claims;

    if (!user) {
      const err = new Error('No autorizado - Debes iniciar sesión');
      err.data = { 
        content: 'Por favor, inicia sesión para usar el chat',
        type: 'auth_required'
      };
      return next(err);
    }
    
    // Adjuntar información del usuario al socket de forma segura
    socket.user = {
      id: user.sub || user.id,
      name: user.name || user.nickname || 'Usuario',
      email: user.email,
      picture: user.picture
    };

    console.log(`[AUTH] Usuario autenticado en socket: ${socket.user.name} (${socket.user.id})`);
    next();
  };
}

/**
 * Middleware para agregar información de usuario a la request
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 * @returns {void}
 */
function attachUser(req, res, next) {
  if (req.oidc?.isAuthenticated()) {
    req.user = {
      id: req.oidc.user.sub,
      name: req.oidc.user.name || req.oidc.user.nickname,
      email: req.oidc.user.email,
      picture: req.oidc.user.picture,
      emailVerified: req.oidc.user.email_verified
    };
  }
  next();
}

/**
 * Middleware para verificar que el email esté verificado
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 * @returns {void}
 */
function requireVerifiedEmail(req, res, next) {
  if (!req.user || !req.user.emailVerified) {
    return res.status(403).json({
      error: 'Email no verificado',
      message: 'Por favor, verifica tu email antes de usar el chat'
    });
  }
  next();
}

/**
 * Manejo de errores de autenticación
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 * @returns {void}
 */
function authErrorHandler(err, req, res, next) {
  // Errores de Auth0
  if (err.name === 'UnauthorizedError') {
    console.error('[AUTH ERROR]', err.message);
    return res.status(401).json({
      error: 'Error de autenticación',
      message: 'Token inválido o expirado. Por favor, inicia sesión nuevamente.'
    });
  }

  // Errores de sesión
  if (err.code === 'EBADCSRFTOKEN') {
    console.error('[CSRF ERROR]', err.message);
    return res.status(403).json({
      error: 'Token CSRF inválido',
      message: 'Por favor, recarga la página e intenta nuevamente.'
    });
  }

  // Otros errores
  next(err);
}

module.exports = {
  authMiddleware,
  requireAuth,
  socketAuthMiddleware,
  attachUser,
  requireVerifiedEmail,
  authErrorHandler
};
