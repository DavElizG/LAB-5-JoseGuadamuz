# Configuración de Auth0 para UNA-Chat

## Descripción General

Este documento describe cómo configurar Auth0 para autenticación en el proyecto UNA-Chat.

## Prerrequisitos

1. Cuenta en Auth0 (gratuita): https://auth0.com/signup
2. Node.js instalado
3. Proyecto UNA-Chat clonado

## Pasos de Configuración

### 1. Crear una Aplicación en Auth0

1. Inicia sesión en [Auth0 Dashboard](https://manage.auth0.com/)
2. Ve a **Applications** > **Applications** en el menú lateral
3. Haz clic en **Create Application**
4. Configura:
   - **Name**: UNA-Chat
   - **Application Type**: Regular Web Applications
   - Haz clic en **Create**

### 2. Configurar la Aplicación

En la pestaña **Settings** de tu aplicación:

#### Allowed Callback URLs
```
http://localhost:3000/callback
```

#### Allowed Logout URLs
```
http://localhost:3000
```

#### Allowed Web Origins
```
http://localhost:3000
```

#### Application URIs
- **Application Login URI**: (dejar vacío)

Haz clic en **Save Changes**

### 3. Obtener Credenciales

En la misma página de **Settings**, copia:

- **Domain**: (ej: `dev-abc123.us.auth0.com`)
- **Client ID**: (string largo aleatorio)
- **Client Secret**: (string largo aleatorio - MANTENER SECRETO)

### 4. Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` y configura:

```bash
# Auth0 Configuration
AUTH0_DOMAIN=tu-tenant.auth0.com
AUTH0_CLIENT_ID=tu_client_id_aqui
AUTH0_CLIENT_SECRET=tu_client_secret_aqui
AUTH0_CALLBACK_URL=http://localhost:3000/callback

# Session Secret (genera uno único)
SESSION_SECRET=clave_secreta_muy_larga_y_aleatoria_aqui
```

### 5. Generar SESSION_SECRET Seguro

Ejecuta en terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copia el resultado y úsalo como `SESSION_SECRET` en tu archivo `.env`

### 6. Instalar Dependencias

```bash
npm install
```

Las dependencias de Auth0 ya están incluidas:
- `express-openid-connect`
- `express-session`

### 7. Iniciar la Aplicación

```bash
npm start
```

La aplicación estará disponible en: http://localhost:3000

## Flujo de Autenticación

### 1. Login
- Usuario accede a `http://localhost:3000`
- Si no está autenticado, es redirigido automáticamente a `/login`
- Auth0 muestra pantalla de login
- Usuario ingresa credenciales
- Auth0 redirige a `/callback` con token
- Aplicación establece sesión
- Usuario es redirigido a la página principal

### 2. Uso del Chat
- Usuario autenticado puede enviar mensajes
- El nombre y avatar provienen de Auth0
- Cada mensaje incluye información del usuario autenticado

### 3. Logout
- Usuario hace clic en "Cerrar Sesión"
- Sesión se cierra en la aplicación
- Sesión se cierra en Auth0
- Usuario es redirigido a la página principal

## Rutas Disponibles

| Ruta | Descripción | Requiere Auth |
|------|-------------|---------------|
| `/` | Página principal del chat | ✅ Sí |
| `/login` | Iniciar sesión (manejado por Auth0) | ❌ No |
| `/logout` | Cerrar sesión | ❌ No |
| `/callback` | Callback de Auth0 (automático) | ❌ No |
| `/profile` | Información del usuario | ✅ Sí |

## Seguridad Implementada

### Protecciones Activas

1. **Helmet**: Headers de seguridad HTTP
2. **CORS**: Control de orígenes permitidos
3. **Rate Limiting**: Límite de peticiones por IP
4. **Session Security**: 
   - Cookies HttpOnly
   - Cookies Secure (solo HTTPS en producción)
   - SameSite protection contra CSRF
5. **Auth0**:
   - OAuth 2.0 / OpenID Connect
   - Tokens JWT seguros
   - Gestión de sesiones

### Mejores Prácticas

- ✅ Secretos en variables de entorno
- ✅ Validación de mensajes
- ✅ Sanitización de inputs
- ✅ Autenticación requerida para chat
- ✅ Session timeout (24 horas)
- ✅ Logging de eventos de seguridad

## Configuración para Producción

### 1. Variables de Entorno

```bash
NODE_ENV=production
BASE_URL=https://tu-dominio.com
AUTH0_CALLBACK_URL=https://tu-dominio.com/callback
AUTH0_LOGOUT_URL=https://tu-dominio.com
ALLOWED_ORIGINS=https://tu-dominio.com
```

### 2. En Auth0 Dashboard

Actualiza las URLs permitidas:

**Allowed Callback URLs**:
```
https://tu-dominio.com/callback
```

**Allowed Logout URLs**:
```
https://tu-dominio.com
```

**Allowed Web Origins**:
```
https://tu-dominio.com
```

### 3. SSL/TLS

- Asegúrate de usar HTTPS en producción
- Las cookies se marcarán automáticamente como `Secure`

### 4. Social Connections (Opcional)

En Auth0 Dashboard > Authentication > Social:

Puedes habilitar login con:
- Google
- Facebook
- GitHub
- Twitter
- Y muchos más

## Personalización

### Customizar la Pantalla de Login

1. Ve a **Branding** > **Universal Login** en Auth0 Dashboard
2. Personaliza colores, logos y textos
3. Guarda los cambios

### Agregar Campos Personalizados

En Auth0 Dashboard > Actions > Flows:

Puedes agregar campos personalizados al perfil del usuario mediante Actions.

## Solución de Problemas

### Error: "unauthorized_client"

**Causa**: Las URLs de callback no coinciden

**Solución**: 
1. Verifica que `AUTH0_CALLBACK_URL` en `.env` coincida exactamente con la configurada en Auth0
2. Asegúrate de incluir el protocolo (`http://` o `https://`)

### Error: "invalid_grant"

**Causa**: Session secret inválido o cambiado

**Solución**:
1. Genera un nuevo `SESSION_SECRET`
2. Reinicia el servidor
3. Limpia cookies del navegador

### No se carga el perfil del usuario

**Causa**: Middleware de Auth0 no configurado correctamente

**Solución**:
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs del servidor
3. Asegúrate de que `authMiddleware` esté antes de las rutas

### Socket.IO no conecta

**Causa**: Usuario no autenticado

**Solución**:
1. Asegúrate de estar autenticado antes de conectar
2. Verifica que la sesión esté activa
3. Revisa la consola del navegador para errores

## Monitoreo y Logs

### Logs de Auth0

En Auth0 Dashboard > Monitoring > Logs:

Puedes ver:
- Intentos de login exitosos/fallidos
- Registros de usuarios
- Cambios de configuración
- Errores de autenticación

### Logs de la Aplicación

El servidor registra:
- Conexiones Socket.IO
- Mensajes procesados
- Errores de autenticación
- Advertencias de seguridad

## Recursos Adicionales

- [Auth0 Documentation](https://auth0.com/docs)
- [Express OpenID Connect SDK](https://github.com/auth0/express-openid-connect)
- [Auth0 Security Best Practices](https://auth0.com/docs/secure)
- [OAuth 2.0 Specification](https://oauth.net/2/)

## Contacto y Soporte

Para problemas o preguntas:
- Revisa la documentación de Auth0
- Consulta los logs del servidor
- Verifica la configuración de variables de entorno

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0.0
**Mantenedor**: Equipo UNA-Chat
