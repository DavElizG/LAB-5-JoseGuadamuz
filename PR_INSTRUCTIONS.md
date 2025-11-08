# 🔄 Instrucciones para crear Pull Request: Development → development

## 📋 Situación Actual

Hay **DOS ramas diferentes** en el repositorio:
1. **`Development`** (mayúscula) - Contiene el código de Auth0 ✅
2. **`development`** (minúscula) - Rama protegida que usa Render 🔒

El código de Auth0 está en `Development` pero Render está desplegando desde `development`.

## 🎯 Solución: Crear Pull Request en GitHub

### Opción 1: Desde la Web de GitHub (MÁS FÁCIL)

1. **Ve a GitHub:**
   ```
   https://github.com/DavElizG/LAB-5-JoseGuadamuz
   ```

2. **Verás un banner amarillo que dice:**
   ```
   "Development had recent pushes X minutes ago"
   [Compare & pull request]
   ```
   
3. **Click en "Compare & pull request"**

4. **Configura el Pull Request:**
   - **Base branch:** `development` (minúscula) ⬅️ La rama destino
   - **Compare branch:** `Development` (mayúscula) ⬅️ La rama origen
   - **Title:** `feat: Integrate Auth0 authentication from Development branch`
   - **Description:**
     ```markdown
     ## 🔐 Auth0 Authentication Implementation
     
     This PR integrates the complete Auth0 OAuth 2.0 authentication system from the `Development` branch.
     
     ### ✨ Features Added
     - Auth0 OAuth 2.0/OpenID Connect integration
     - User authentication with login/logout flows
     - Protected routes middleware
     - Socket.IO authentication
     - User profile display with avatars
     - Image upload and paste functionality (base64 support)
     - XSS protection with server-side validation
     - Enhanced CSP for multimedia content
     
     ### 📦 Dependencies Added
     - express-openid-connect v2.19.2
     - express-session v1.18.2
     - socket.io v4.8.1
     - passport v0.7.0
     - passport-auth0 v1.4.5
     
     ### 📁 New Files
     - `config/auth0.config.js` - Auth0 configuration
     - `middleware/auth.middleware.js` - Authentication middleware
     - `docs/AUTH0_SETUP.md` - Setup documentation
     
     ### 🔧 Modified Files
     - `server.js` - Added Auth0 routes and middleware
     - `index.html` - Updated UI with user profile
     - `libs/unalib.js` - Added base64 image support
     - `package.json` - Updated dependencies
     
     ### ⚙️ Environment Variables Required (Render)
     ```bash
     AUTH0_DOMAIN=dev-14txugpga1rb087e.us.auth0.com
     AUTH0_CLIENT_ID=glhqhWxAQCwsc3TJcSoMety4WG096Cgm
     AUTH0_CLIENT_SECRET=***
     AUTH0_CALLBACK_URL=https://lab-5-joseguadamuz.onrender.com/callback
     AUTH0_LOGOUT_URL=https://lab-5-joseguadamuz.onrender.com
     SESSION_SECRET=***
     ```
     
     ### 📝 Testing
     - [x] Local testing completed
     - [x] Auth0 login/logout working
     - [x] Socket.IO chat functional
     - [x] Image upload/paste working
     - [x] XSS protection validated with Snyk
     - [ ] Production deployment pending (after merge)
     
     ### 🔗 Related Issues
     Closes #[issue-number] (if applicable)
     
     ### 📸 Screenshots
     (Optional: Add screenshots of the Auth0 login flow)
     ```

5. **Click "Create pull request"**

6. **Espera revisión o haz merge** (si tienes permisos)

### Opción 2: Desde la línea de comandos (GitHub CLI)

Si tienes `gh` CLI instalado:

```bash
gh pr create --base development --head Development --title "feat: Integrate Auth0 authentication" --body "Auth0 implementation from Development branch"
```

### Opción 3: URL Directa

Abre este link en tu navegador:
```
https://github.com/DavElizG/LAB-5-JoseGuadamuz/compare/development...Development
```

Esto te llevará directamente a la página de comparación donde puedes crear el PR.

## ⚠️ Nota Importante

La rama `development` tiene **branch protection rules**, por lo que:
- ✅ Necesitas crear un Pull Request (no puedes hacer push directo)
- ✅ Puede requerir revisión de código
- ✅ Pueden ejecutarse checks automáticos (CI/CD)
- ✅ Una vez aprobado, se puede hacer merge

## 🚀 Después del Merge

Una vez que el PR sea mergeado a `development`:

1. **Render detectará el cambio** automáticamente
2. **Iniciará un nuevo deploy** (~2-3 minutos)
3. **Necesitas configurar las variables de entorno** en Render (ver `docs/RENDER_DEPLOYMENT.md`)
4. **Verificar que la app funcione** en https://lab-5-joseguadamuz.onrender.com

## 🔍 Verificar el Estado

Puedes ver todas las ramas remotas con:
```bash
git ls-remote --heads origin
```

- `refs/heads/Development` - Rama con Auth0 (mayúscula)
- `refs/heads/development` - Rama protegida para deploy (minúscula)

---

**Última actualización:** Noviembre 8, 2025
