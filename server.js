// npm install para descargar los paquetes...

// Security and utility libraries
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
require('dotenv').config();

// Auth0 and authentication
const { authMiddleware, attachUser, requireAuth } = require('./middleware/auth.middleware');

// Application libraries
const validation = require('./libs/unalib');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

// Security Configuration
app.disable('x-powered-by'); // Hide Express.js signature

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      scriptSrc: [
        '\'self\'', 
        '\'unsafe-inline\'',
        'https://cdn.socket.io',
        'https://code.jquery.com'
      ],
      styleSrc: ['\'self\'', '\'unsafe-inline\''],
      connectSrc: [
        '\'self\'',
        'ws://localhost:3000',
        'wss://lab-5-joseguadamuz.onrender.com'
      ],
      imgSrc: [
        '\'self\'',
        'data:',
        'https:',
        'http:',
        'https://*.auth0.com',
        'https://*.gravatar.com',
        'https://*.googleusercontent.com',
        'https://*.ytimg.com',
        'https://i.ytimg.com'
      ],
      frameSrc: [
        '\'self\'',
        'https://www.youtube.com',
        'https://youtube.com',
        'https://www.youtube-nocookie.com'
      ],
      mediaSrc: [
        '\'self\'',
        'https:',
        'http:',
        'data:',
        'blob:'
      ]
    }
  }
}));

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(compression());

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// JSON body parser with size limit - Aumentado para soportar imágenes base64
app.use(require('express').json({ limit: '10mb' }));

// Auth0 authentication middleware
app.use(authMiddleware);

// Attach user information to request
app.use(attachUser);

// root: presentar html (protegido - requiere autenticación)
app.get('/', requireAuth, function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Ruta de perfil de usuario
app.get('/profile', requireAuth, function (req, res) {
  res.json({
    user: req.user
  });
});

// escuchar una conexion por socket
io.on('connection', function (socket) {
  console.log(`[SECURITY] Nueva conexión Socket.IO: ${socket.id} desde ${socket.handshake.address}`);

  // Rate limiting para mensajes por socket
  let messageCount = 0;
  const messageLimit = 10; // 10 mensajes por minuto por socket
  const messageWindow = 60 * 1000; // 1 minuto

  setInterval(() => {
    messageCount = 0; // Reset counter every minute
  }, messageWindow);

  // si se escucha "chat message"
  socket.on('Evento-Mensaje-Server', function (msg) {
    try {
      // Rate limiting por socket
      messageCount++;
      if (messageCount > messageLimit) {
        socket.emit('error', 'Demasiados mensajes, espera un momento');
        return;
      }

      // Validación básica del mensaje
      if (!msg || typeof msg !== 'string') {
        socket.emit('error', 'Mensaje inválido');
        return;
      }

      // Validación de longitud - Permitir más caracteres para imágenes base64
      const maxLength = msg.includes('data:image') ? 5000000 : 500; // 5MB para imágenes, 500 chars para texto
      if (msg.length > maxLength) {
        socket.emit('error', msg.includes('data:image') 
          ? 'Imagen demasiado grande (máximo 5MB)' 
          : 'Mensaje demasiado largo (máximo 500 caracteres)');
        return;
      }

      // Validación y sanitización usando unalib
      const sanitizedMsg = validation.validateMessage(msg);

      // Log de seguridad
      const logMsg = sanitizedMsg.includes('data:image') 
        ? '[IMAGE]' 
        : sanitizedMsg.substring(0, 50);
      console.log(`[SECURITY] Mensaje procesado de ${socket.id}: ${logMsg}...`);

      // volvemos a emitir el mismo mensaje
      io.emit('Evento-Mensaje-Server', sanitizedMsg);
    } catch (error) {
      console.error(`[ERROR] Error procesando mensaje de ${socket.id}:`, error.message);
      socket.emit('error', 'Error procesando mensaje');
    }
  });

  // Manejar desconexión
  socket.on('disconnect', function () {
    console.log(`[SECURITY] Desconexión Socket.IO: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${err.stack}`);

  // No exponer detalles del error en producción
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Error interno del servidor' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

// Iniciar servidor con logging mejorado
http.listen(port, function () {
  const separator = '=========================================';
  console.log(separator);
  console.log('🚀 LAB-5-UNACHAT Server Iniciado');
  console.log(separator);
  console.log(`📡 Puerto: ${port}`);
  console.log(`🔒 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log('🛡️  Seguridad: Helmet, CORS, Rate Limiting activados');
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log(separator);

  // Configuración de entorno recomendada
  if (!process.env.NODE_ENV) {
    console.log('⚠️  ADVERTENCIA: NODE_ENV no configurado, usando development');
  }

  if (!process.env.ALLOWED_ORIGINS) {
    console.log('⚠️  ADVERTENCIA: ALLOWED_ORIGINS no configurado, usando localhost:3000');
  }
});
