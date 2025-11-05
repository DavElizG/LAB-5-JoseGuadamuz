---
description: Technology Stack Documentation and Best Practices for UNA-Chat
applyTo: "**/*.{js,html,json}"
---

# Stack Tecnológico - Proyecto UNA-Chat

## 1. Node.js

### 1.1 Versión y Configuración
- **Versión mínima**: Node.js 14.x LTS o superior
- **Versión recomendada**: Node.js 18.x LTS o Node.js 20.x LTS
- **Package Manager**: npm 8.x o superior

### 1.2 Best Practices Node.js
```javascript
// ✅ Usar strict mode
'use strict';

// ✅ Usar async/await en lugar de callbacks
async function fetchData() {
    try {
        const result = await database.query();
        return result;
    } catch (error) {
        logger.error('Database error:', error);
        throw error;
    }
}

// ❌ Evitar callback hell
database.query(function(err, result) {
    if (err) {
        console.log(err);
    } else {
        doSomething(result, function(err, data) {
            // ...más callbacks anidados
        });
    }
});
```

### 1.3 Seguridad en Node.js
- Nunca usar `eval()`, `Function()`, o `vm.runInThisContext()`
- Validar y sanitizar todas las entradas
- Usar helmet para headers de seguridad HTTP
- Implementar rate limiting
- Mantener dependencias actualizadas

**Documentación**: 
- https://nodejs.org/en/docs/
- https://nodejs.org/en/docs/guides/security/
- https://github.com/goldbergyoni/nodebestpractices

---

## 2. Express.js

### 2.1 Configuración Segura
```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// ✅ Seguridad: Headers HTTP seguros
app.use(helmet());

// ✅ Seguridad: Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de requests
    message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// ✅ Seguridad: Deshabilitar header X-Powered-By
app.disable('x-powered-by');

// ✅ Parse JSON con límite de tamaño
app.use(express.json({ limit: '10kb' }));

// ✅ CORS configurado apropiadamente
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN);
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    next();
});
```

### 2.2 Middleware Pattern
```javascript
// ✅ Middleware de validación
const validateInput = (req, res, next) => {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Invalid message' });
    }
    
    if (message.length > 500) {
        return res.status(400).json({ error: 'Message too long' });
    }
    
    next();
};

// ✅ Middleware de sanitización
const sanitizeInput = (req, res, next) => {
    const validator = require('validator');
    req.body.message = validator.escape(req.body.message);
    next();
};

app.post('/message', validateInput, sanitizeInput, (req, res) => {
    // El mensaje ya está validado y sanitizado
});
```

### 2.3 Manejo de Errores
```javascript
// ✅ Error handler centralizado
app.use((err, req, res, next) => {
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    });
    
    // No exponer detalles internos en producción
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;
    
    res.status(statusCode).json({ error: message });
});
```

**Documentación**: 
- https://expressjs.com/
- https://expressjs.com/en/advanced/best-practice-security.html
- https://expressjs.com/en/advanced/best-practice-performance.html

---

## 3. Socket.IO

### 3.1 Configuración Segura
```javascript
const io = require('socket.io')(http, {
    // ✅ Configurar CORS apropiadamente
    cors: {
        origin: process.env.ALLOWED_ORIGIN,
        methods: ['GET', 'POST'],
        credentials: true
    },
    
    // ✅ Límite de tamaño de mensaje
    maxHttpBufferSize: 1e6, // 1MB
    
    // ✅ Timeout de conexión
    pingTimeout: 60000,
    pingInterval: 25000
});
```

### 3.2 Validación y Sanitización
```javascript
// ✅ Validar TODOS los eventos del cliente
io.on('connection', (socket) => {
    
    socket.on('Evento-Mensaje-Server', (msg) => {
        // Validar tipo
        if (typeof msg !== 'string') {
            socket.emit('error', 'Invalid message type');
            return;
        }
        
        // Validar longitud
        if (msg.length > 500) {
            socket.emit('error', 'Message too long');
            return;
        }
        
        // Sanitizar
        const sanitized = validator.escape(msg);
        
        // Emitir mensaje seguro
        io.emit('Evento-Mensaje-Server', sanitized);
    });
    
    // ✅ Manejar desconexión
    socket.on('disconnect', (reason) => {
        logger.info(`Socket disconnected: ${reason}`);
    });
    
    // ✅ Manejar errores
    socket.on('error', (error) => {
        logger.error('Socket error:', error);
    });
});
```

### 3.3 Namespaces y Rooms
```javascript
// ✅ Usar namespaces para separar funcionalidades
const chatNamespace = io.of('/chat');
const adminNamespace = io.of('/admin');

chatNamespace.on('connection', (socket) => {
    // Lógica del chat
    
    // ✅ Validar antes de unir a room
    socket.on('join-room', (roomId) => {
        if (!isValidRoomId(roomId)) {
            socket.emit('error', 'Invalid room ID');
            return;
        }
        socket.join(roomId);
    });
});
```

### 3.4 Autenticación
```javascript
// ✅ Middleware de autenticación
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
        return next(new Error('Authentication required'));
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.userId;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
});
```

**Documentación**: 
- https://socket.io/docs/v4/
- https://socket.io/docs/v4/security/
- https://socket.io/docs/v4/server-api/
- https://socket.io/docs/v4/emit-cheatsheet/

---

## 4. Mocha (Testing Framework)

### 4.1 Estructura de Tests
```javascript
const { expect } = require('chai');
const request = require('supertest');
const app = require('../server');

describe('Chat API', () => {
    
    describe('POST /message', () => {
        
        it('should accept valid messages', async () => {
            const response = await request(app)
                .post('/message')
                .send({ message: 'Hello World' })
                .expect(200);
            
            expect(response.body).to.have.property('success', true);
        });
        
        it('should reject empty messages', async () => {
            const response = await request(app)
                .post('/message')
                .send({ message: '' })
                .expect(400);
            
            expect(response.body).to.have.property('error');
        });
        
        it('should sanitize XSS attempts', async () => {
            const malicious = '<script>alert("xss")</script>';
            const response = await request(app)
                .post('/message')
                .send({ message: malicious })
                .expect(200);
            
            expect(response.body.message).to.not.include('<script>');
        });
    });
});
```

### 4.2 Hooks y Setup
```javascript
describe('Chat System', () => {
    
    // ✅ Setup antes de todos los tests
    before(async () => {
        await database.connect();
        await seedTestData();
    });
    
    // ✅ Cleanup después de todos los tests
    after(async () => {
        await database.clearTestData();
        await database.disconnect();
    });
    
    // ✅ Reset antes de cada test
    beforeEach(async () => {
        await cache.clear();
    });
    
    // ✅ Cleanup después de cada test
    afterEach(() => {
        sinon.restore();
    });
});
```

### 4.3 Mocking y Spies
```javascript
const sinon = require('sinon');

describe('Message Service', () => {
    
    it('should log errors when validation fails', () => {
        // ✅ Spy en el logger
        const loggerSpy = sinon.spy(logger, 'error');
        
        try {
            messageService.validate(null);
        } catch (error) {
            // esperado
        }
        
        expect(loggerSpy.calledOnce).to.be.true;
        expect(loggerSpy.firstCall.args[0]).to.include('validation');
    });
    
    it('should call external API with correct params', async () => {
        // ✅ Stub de API externa
        const apiStub = sinon.stub(externalAPI, 'send')
            .resolves({ success: true });
        
        await messageService.broadcast('test message');
        
        expect(apiStub.calledOnce).to.be.true;
        expect(apiStub.firstCall.args[0]).to.equal('test message');
    });
});
```

**Documentación**: 
- https://mochajs.org/
- https://www.chaijs.com/
- https://sinonjs.org/
- https://github.com/visionmedia/supertest

---

## 5. HTML5 y Frontend

### 5.1 Seguridad en el Cliente
```html
<!-- ✅ Content Security Policy -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline' cdn.socket.io; style-src 'self' 'unsafe-inline';">

<!-- ✅ XSS Protection -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">
<meta http-equiv="X-Frame-Options" content="DENY">
```

### 5.2 JavaScript del Cliente
```javascript
// ✅ Sanitizar antes de mostrar en DOM
function displayMessage(msg) {
    const li = document.createElement('li');
    // Usar textContent en lugar de innerHTML
    li.textContent = msg;
    document.getElementById('messages').appendChild(li);
}

// ❌ NUNCA hacer esto
function displayMessageUnsafe(msg) {
    // ¡Vulnerable a XSS!
    document.getElementById('messages').innerHTML += `<li>${msg}</li>`;
}
```

### 5.3 Socket.IO Cliente
```javascript
// ✅ Configuración segura del cliente
const socket = io({
    // Reconexión automática
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    
    // Timeout
    timeout: 20000,
    
    // Autenticación
    auth: {
        token: getAuthToken()
    }
});

// ✅ Manejar eventos de conexión
socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
    if (reason === 'io server disconnect') {
        // Reconectar manualmente
        socket.connect();
    }
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

// ✅ Validar mensajes recibidos
socket.on('Evento-Mensaje-Server', (msg) => {
    if (typeof msg !== 'string') {
        console.error('Invalid message type received');
        return;
    }
    displayMessage(msg);
});
```

**Documentación**: 
- https://developer.mozilla.org/en-US/docs/Web/HTML
- https://developer.mozilla.org/en-US/docs/Web/API
- https://socket.io/docs/v4/client-api/

---

## 6. Validación y Sanitización

### 6.1 Librería: validator.js
```javascript
const validator = require('validator');

// ✅ Validaciones comunes
function validateUserInput(input) {
    // Tipo y existencia
    if (!input || typeof input !== 'string') {
        throw new Error('Invalid input type');
    }
    
    // Longitud
    if (!validator.isLength(input, { min: 1, max: 500 })) {
        throw new Error('Invalid input length');
    }
    
    // Caracteres permitidos
    if (!validator.matches(input, /^[a-zA-Z0-9\s.,!?áéíóúñÁÉÍÓÚÑ]+$/)) {
        throw new Error('Invalid characters');
    }
    
    return true;
}

// ✅ Sanitización
function sanitizeUserInput(input) {
    // Escape HTML
    let sanitized = validator.escape(input);
    
    // Trim whitespace
    sanitized = validator.trim(sanitized);
    
    // Normalizar espacios
    sanitized = sanitized.replace(/\s+/g, ' ');
    
    return sanitized;
}
```

### 6.2 Validación de URLs e Imágenes
```javascript
// ✅ Mejorar validación de URLs de imágenes
function isValidImageUrl(url) {
    // Validar formato URL
    if (!validator.isURL(url, {
        protocols: ['http', 'https'],
        require_protocol: true
    })) {
        return false;
    }
    
    // Validar extensión de imagen
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i;
    if (!imageExtensions.test(url)) {
        return false;
    }
    
    // Validar dominio permitido (whitelist)
    const allowedDomains = ['imgur.com', 'i.imgur.com', 'cdn.example.com'];
    try {
        const urlObj = new URL(url);
        const isAllowedDomain = allowedDomains.some(domain => 
            urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
        );
        return isAllowedDomain;
    } catch {
        return false;
    }
}
```

**Documentación**: 
- https://github.com/validatorjs/validator.js
- https://www.npmjs.com/package/validator

---

## 7. Logging y Monitoreo

### 7.1 Winston Logger
```javascript
const winston = require('winston');

// ✅ Configuración de logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'una-chat' },
    transports: [
        // Log de errores
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error' 
        }),
        // Log combinado
        new winston.transports.File({ 
            filename: 'logs/combined.log' 
        })
    ]
});

// En desarrollo, log a consola
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// ✅ Uso del logger
logger.info('Server started', { port: 3000 });
logger.warn('High memory usage', { usage: '85%' });
logger.error('Database connection failed', { error: err.message });
```

**Documentación**: 
- https://github.com/winstonjs/winston

---

## 8. Variables de Entorno

### 8.1 Configuración con dotenv
```javascript
// ✅ Cargar variables de entorno
require('dotenv').config();

// ✅ Validar variables requeridas al inicio
const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'JWT_SECRET',
    'DATABASE_URL'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Missing required environment variable: ${varName}`);
    }
});

// ✅ Usar variables de entorno
const config = {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 3000,
    jwtSecret: process.env.JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    allowedOrigin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000'
};

module.exports = config;
```

### 8.2 Archivo .env.example
```bash
# Crear siempre un .env.example con valores de ejemplo
# NUNCA commitear el .env real

NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-here
DATABASE_URL=mongodb://localhost:27017/una-chat
ALLOWED_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

**Documentación**: 
- https://github.com/motdotla/dotenv

---

## 9. Package.json Scripts

### 9.1 Scripts Recomendados
```json
{
    "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js",
        "test": "mocha test/**/*.test.js",
        "test:watch": "mocha test/**/*.test.js --watch",
        "test:coverage": "nyc mocha test/**/*.test.js",
        "lint": "eslint .",
        "lint:fix": "eslint . --fix",
        "security:audit": "npm audit --audit-level=moderate",
        "security:snyk": "snyk test",
        "build": "npm ci && npm run lint && npm test",
        "validate": "npm run lint && npm run test && npm run security:audit"
    }
}
```

---

## 10. Checklist de Tecnologías

### Al trabajar con Node.js:
- [ ] Usar versión LTS
- [ ] Implementar manejo de errores no capturados
- [ ] Usar `process.env` para configuración
- [ ] Implementar graceful shutdown

### Al trabajar con Express:
- [ ] Configurar helmet
- [ ] Implementar rate limiting
- [ ] Configurar CORS apropiadamente
- [ ] Implementar error handler centralizado

### Al trabajar con Socket.IO:
- [ ] Configurar CORS
- [ ] Validar TODOS los eventos del cliente
- [ ] Implementar autenticación si es necesario
- [ ] Manejar reconexiones

### Al escribir Tests:
- [ ] Usar describe/it pattern
- [ ] Implementar hooks de setup/teardown
- [ ] Mockear dependencias externas
- [ ] Alcanzar mínimo 80% cobertura

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0.0
