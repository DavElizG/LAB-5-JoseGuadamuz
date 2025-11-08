# 🚀 Despliegue en Render con Auth0

## ✅ Pasos Completados

- [x] Código Auth0 mergeado a rama `Development`
- [x] Push a GitHub completado
- [x] Render debería auto-desplegar en unos minutos

## 📋 Configuración de Variables de Entorno en Render

### 1. Accede a tu Dashboard de Render
1. Ve a: https://dashboard.render.com
2. Selecciona tu servicio `lab-5-joseguadamuz`
3. Ve a **Environment** en el menú lateral

### 2. Configura las siguientes variables de entorno:

```bash
# ===========================================
# PRODUCCIÓN - Variables Obligatorias
# ===========================================

NODE_ENV=production
PORT=3000
BASE_URL=https://lab-5-joseguadamuz.onrender.com

# Auth0 Configuration
AUTH0_DOMAIN=dev-14txugpga1rb087e.us.auth0.com
AUTH0_CLIENT_ID=glhqhWxAQCwsc3TJcSoMety4WG096Cgm
AUTH0_CLIENT_SECRET=K8OYi98jm3Ndgj5gBGISw3GlEOg4arTa603tInrVEZOiPH-SLTwuUW9-I6VSDOHi
AUTH0_CALLBACK_URL=https://lab-5-joseguadamuz.onrender.com/callback
AUTH0_LOGOUT_URL=https://lab-5-joseguadamuz.onrender.com

# Session Secret (ya tienes este generado)
SESSION_SECRET=6bedcf4e20d8f127303f719ff6f3490e31d0b23fff34eddf07c174ec6db9d94b

# CORS Configuration
ALLOWED_ORIGINS=https://lab-5-joseguadamuz.onrender.com

# Rate Limiting (opcional - usa defaults si no configuras)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security Settings (opcional - usa defaults si no configuras)
MAX_MESSAGE_LENGTH=500
JSON_BODY_LIMIT=10mb
SOCKET_MESSAGE_LIMIT=10
SOCKET_MESSAGE_WINDOW=60000
```

### 3. Configura Auth0 Dashboard

**CRÍTICO**: Ve a tu Auth0 Dashboard y configura:

#### a) Allowed Callback URLs
```
https://lab-5-joseguadamuz.onrender.com/callback
http://localhost:3000/callback
```

#### b) Allowed Logout URLs
```
https://lab-5-joseguadamuz.onrender.com
http://localhost:3000
```

#### c) Allowed Web Origins
```
https://lab-5-joseguadamuz.onrender.com
http://localhost:3000
```

#### d) Application URIs
```
Application Login URI: https://lab-5-joseguadamuz.onrender.com/login
```

**Pasos en Auth0:**
1. Ve a: https://manage.auth0.com
2. Applications > Applications
3. Selecciona tu aplicación
4. Ve a **Settings** tab
5. Scroll down a **Application URIs**
6. Agrega las URLs mencionadas arriba
7. Click **Save Changes** al final de la página

### 4. Verifica el Despliegue

1. **Espera 2-3 minutos** para que Render termine de desplegar
2. Ve a: https://lab-5-joseguadamuz.onrender.com
3. Deberías ver la página principal del chat
4. Click en **Iniciar Sesión** (o será redirigido automáticamente)
5. Autentícate con Auth0
6. Deberías volver a la app con tu perfil y avatar cargados

### 5. Verificar Logs en Render

Si algo falla:
1. Ve al dashboard de Render
2. Click en **Logs** en el menú lateral
3. Busca errores como:
   - `AUTH0_DOMAIN is required`
   - `Session secret is required`
   - `ECONNREFUSED` (significa que Auth0 no puede conectar)

## 🔧 Troubleshooting

### Problema: `ERR_CONNECTION_REFUSED` en `/callback`
**Causa**: Auth0 está configurado pero las variables de entorno en Render no están

**Solución**:
1. Verifica que todas las variables estén configuradas en Render
2. Haz un **Manual Deploy** desde el dashboard de Render
3. Espera 2-3 minutos

### Problema: "Callback URL mismatch"
**Causa**: La URL en Auth0 no coincide con la configurada

**Solución**:
1. Verifica que en Auth0 Dashboard tengas EXACTAMENTE:
   - `https://lab-5-joseguadamuz.onrender.com/callback`
2. Verifica que `AUTH0_CALLBACK_URL` en Render sea idéntica
3. Guarda cambios en Auth0 (puede tardar 1-2 minutos en aplicar)

### Problema: El servidor no inicia
**Causa**: Falta alguna dependencia o variable de entorno

**Solución**:
1. Revisa logs de Render
2. Verifica que todas las variables obligatorias estén configuradas
3. Si falta `express-openid-connect`, Render debería instalarla automáticamente de `package.json`

### Problema: "Invalid state"
**Causa**: Problema con las cookies de sesión

**Solución**:
1. Verifica que `SESSION_SECRET` esté configurado en Render
2. Limpia cookies del navegador
3. Intenta en modo incógnito

## ✅ Checklist Final

- [ ] Variables de entorno configuradas en Render
- [ ] Callback URLs configuradas en Auth0 Dashboard
- [ ] Logout URLs configuradas en Auth0 Dashboard
- [ ] Código desplegado en Render (ver logs)
- [ ] Servicio corriendo (status: Live)
- [ ] Puedo acceder a `https://lab-5-joseguadamuz.onrender.com`
- [ ] Puedo hacer login con Auth0
- [ ] Veo mi perfil y avatar después de login
- [ ] Puedo enviar mensajes en el chat

## 📞 Soporte

Si algo sigue fallando, verifica:
1. Logs de Render
2. Consola del navegador (F12)
3. Network tab para ver qué request falla

---

**Última actualización**: Noviembre 8, 2025
**Branch desplegado**: Development
**Commit**: bac366d - Auth0 implementation
