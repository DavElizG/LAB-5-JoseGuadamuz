---
description: Development Standards and Best Practices for UNA-Chat Project
applyTo: "**"
---

# Estándares de Desarrollo - Proyecto UNA-Chat

## 1. Principios Fundamentales

### 1.1 Seguridad desde el Diseño (Security by Design)
- **Siempre** validar y sanitizar toda entrada de usuario
- Implementar principio de mínimo privilegio
- Nunca almacenar información sensible en el código fuente
- Usar variables de entorno para configuraciones sensibles

### 1.2 Tipado Fuerte y JSDoc
- **Obligatorio**: Usar JSDoc para documentar todas las funciones y módulos
- Especificar tipos de parámetros y retornos claramente
- Considerar migración gradual a TypeScript para mayor seguridad de tipos

```javascript
/**
 * Valida un mensaje antes de ser transmitido
 * @param {string} message - El mensaje a validar
 * @returns {string} El mensaje validado y sanitizado
 * @throws {Error} Si el mensaje es inválido
 */
function validateMessage(message) {
    // implementación
}
```

### 1.3 No Crear Archivos Markdown Innecesarios
- **NO** crear archivos `.md` automáticamente a menos que sea explícitamente solicitado
- La documentación debe estar centralizada en archivos de instrucciones específicos
- Evitar documentación redundante

## 2. Estructura de Proyecto y Escalabilidad

### 2.1 Organización de Carpetas
```
project-root/
├── .github/
│   └── instructions/          # Instrucciones para agentes IA
├── src/                       # Código fuente principal
│   ├── controllers/          # Controladores de rutas
│   ├── services/             # Lógica de negocio
│   ├── models/               # Modelos de datos
│   ├── middleware/           # Middleware personalizado
│   ├── validators/           # Validadores y sanitizadores
│   └── utils/                # Utilidades reutilizables
├── libs/                      # Bibliotecas personalizadas (legacy)
├── test/                      # Tests unitarios e integración
│   ├── unit/
│   └── integration/
├── config/                    # Configuraciones
├── public/                    # Archivos estáticos
└── docs/                      # Documentación (solo si necesario)
```

### 2.2 Separación de Responsabilidades
- **Controllers**: Manejo de requests/responses HTTP
- **Services**: Lógica de negocio
- **Validators**: Validación y sanitización
- **Models**: Estructuras de datos
- **Middleware**: Funcionalidades transversales (logging, auth, etc.)

## 3. Convenciones de Código

### 3.1 Nomenclatura
- **Variables y Funciones**: `camelCase`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Clases**: `PascalCase`
- **Archivos**: `kebab-case.js` o `camelCase.js`
- **Carpetas**: `kebab-case` o `camelCase`

```javascript
// ✅ CORRECTO
const userMessage = "Hello";
const MAX_MESSAGE_LENGTH = 500;
class MessageValidator {}

// ❌ INCORRECTO
const UserMessage = "Hello";
const max_message_length = 500;
class messagevalidator {}
```

### 3.2 Formato de Código
- **Indentación**: 2 espacios (no tabs)
- **Punto y coma**: Siempre usar `;` al final de sentencias
- **Comillas**: Preferir comillas simples `'` sobre dobles `"`
- **Longitud de línea**: Máximo 100 caracteres

### 3.3 Manejo de Errores
```javascript
// ✅ CORRECTO - Manejo específico de errores
try {
    const result = await riskyOperation();
    return result;
} catch (error) {
    logger.error('Operation failed:', error);
    throw new AppError('Failed to process request', 500);
}

// ❌ INCORRECTO - Catch vacío o genérico
try {
    await riskyOperation();
} catch (e) {
    console.log(e); // No logging apropiado
}
```

## 4. Reglas de SonarQube

### 4.1 Complejidad Ciclomática
- **Máximo**: 15 por función
- Refactorizar funciones complejas en funciones más pequeñas
- Usar early returns para reducir anidación

### 4.2 Code Smells a Evitar
- **Variables no utilizadas**: Eliminar todas las variables declaradas pero no usadas
- **Funciones duplicadas**: Extraer lógica común en funciones reutilizables
- **Funciones muy largas**: Máximo 50 líneas por función
- **Parámetros excesivos**: Máximo 5 parámetros por función

### 4.3 Vulnerabilidades Comunes
- **SQL Injection**: Usar prepared statements o ORMs
- **XSS**: Sanitizar todas las entradas y salidas HTML
- **Path Traversal**: Validar rutas de archivos
- **Regex DoS**: Evitar expresiones regulares costosas

```javascript
// ❌ VULNERABLE a XSS
io.emit('message', userInput);

// ✅ SEGURO - Sanitizado
const sanitized = validator.escape(userInput);
io.emit('message', sanitized);
```

### 4.4 Mejores Prácticas SonarQube
- No usar `eval()` o `Function()` constructor
- No usar `console.log()` en producción (usar logger apropiado)
- Evitar callbacks anidados (callback hell) - usar Promises/async-await
- Siempre manejar promesas rechazadas

## 5. Behavior-Driven Development (BDD)

### 5.1 Estructura de Tests
```javascript
describe('MessageValidator', () => {
    describe('validateMessage', () => {
        it('should accept valid text messages', () => {
            const result = validateMessage('Hello World');
            expect(result).to.equal('Hello World');
        });

        it('should reject messages with malicious scripts', () => {
            const malicious = '<script>alert("xss")</script>';
            expect(() => validateMessage(malicious)).to.throw();
        });

        it('should sanitize HTML entities', () => {
            const input = '<b>Bold</b>';
            const result = validateMessage(input);
            expect(result).to.not.include('<b>');
        });
    });
});
```

### 5.2 Cobertura de Tests
- **Mínimo**: 80% de cobertura de código
- **Prioridad**: Funciones críticas de seguridad al 100%
- Tests unitarios para toda la lógica de negocio
- Tests de integración para flujos completos

## 6. Linting y Calidad de Código

### 6.1 ESLint Configuration
- Usar `eslint:recommended` como base
- Agregar reglas de seguridad con `eslint-plugin-security`
- Configurar `eslint-plugin-sonarjs` para detectar code smells

### 6.2 Pre-commit Hooks
- **Siempre** ejecutar linting antes de commit
- **Siempre** ejecutar tests antes de commit
- **Siempre** verificar formato de código

### 6.3 Reglas Obligatorias
- No permitir `var`, usar `const` o `let`
- No permitir `==`, usar `===`
- Requerir manejo de errores en callbacks
- Prohibir console.log en producción

## 7. Dependencias y SBOM

### 7.1 Gestión de Dependencias
- Mantener `package.json` actualizado
- Usar versiones específicas (no `*` o `latest`)
- Auditar regularmente con `npm audit`
- Documentar dependencias en SBOM

### 7.2 Evaluación de Librerías
Antes de agregar una dependencia, verificar:
- ✅ Última actualización < 6 meses
- ✅ Múltiples mantenedores activos
- ✅ Sin vulnerabilidades conocidas
- ✅ Licencia compatible con el proyecto
- ✅ Buena documentación y comunidad

## 8. Control de Versiones (Git)

### 8.1 Mensajes de Commit
Formato: `<tipo>(<scope>): <descripción>`

Tipos permitidos:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `security`: Corrección de seguridad
- `refactor`: Refactorización de código
- `test`: Agregar o modificar tests
- `docs`: Documentación
- `chore`: Tareas de mantenimiento

```bash
# ✅ CORRECTO
feat(chat): add message sanitization
fix(validation): prevent XSS in user input
security(auth): implement rate limiting

# ❌ INCORRECTO
Update code
Fixed stuff
Changes
```

### 8.2 Branches
- `main`: Código en producción
- `development`: Código en desarrollo
- `feature/*`: Nuevas funcionalidades
- `fix/*`: Correcciones de bugs
- `security/*`: Correcciones de seguridad

## 9. Construcción y Build

### 9.1 Pre-Build Checklist
- [ ] Ejecutar linting: `npm run lint`
- [ ] Ejecutar tests: `npm test`
- [ ] Verificar cobertura de tests
- [ ] Ejecutar análisis estático (SAST)
- [ ] Verificar dependencias vulnerables

### 9.2 Build Process
```bash
# Verificar instalación limpia
npm ci

# Ejecutar linting
npm run lint

# Ejecutar tests
npm test

# Build del proyecto
npm run build

# Verificar seguridad
npm audit --audit-level=moderate
```

## 10. Referencias y Recursos

### 10.1 Documentación Oficial
- **Node.js Security Best Practices**: https://nodejs.org/en/docs/guides/security/
- **Express.js Security**: https://expressjs.com/en/advanced/best-practice-security.html
- **Socket.IO Security**: https://socket.io/docs/v4/security/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **OWASP Node.js Security Cheat Sheet**: https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html

### 10.2 Herramientas
- **ESLint**: https://eslint.org/
- **Mocha**: https://mochajs.org/
- **Snyk**: https://snyk.io/
- **SonarQube**: https://www.sonarqube.org/
- **npm audit**: https://docs.npmjs.com/cli/v8/commands/npm-audit

### 10.3 Guías de Estilo
- **Airbnb JavaScript Style Guide**: https://github.com/airbnb/javascript
- **Google JavaScript Style Guide**: https://google.github.io/styleguide/jsguide.html
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices

### 10.4 Seguridad
- **OWASP SAST Tools**: https://owasp.org/www-community/Source_Code_Analysis_Tools
- **CWE Top 25**: https://cwe.mitre.org/top25/
- **NIST Secure Software Development**: https://csrc.nist.gov/publications/detail/sp/800-218/final
- **npm Security Best Practices**: https://docs.npmjs.com/packages-and-modules/securing-your-code

## 11. Checklist para Agentes IA

Antes de generar o modificar código, verificar:

- [ ] ¿El código sigue las convenciones de nomenclatura?
- [ ] ¿Se usan tipos fuertes con JSDoc?
- [ ] ¿Se valida y sanitiza toda entrada de usuario?
- [ ] ¿Se maneja apropiadamente los errores?
- [ ] ¿La función tiene menos de 50 líneas?
- [ ] ¿La complejidad ciclomática es menor a 15?
- [ ] ¿Hay tests unitarios para esta funcionalidad?
- [ ] ¿Se evitan code smells de SonarQube?
- [ ] ¿Las dependencias están justificadas y documentadas?
- [ ] ¿El código es escalable y mantenible?
- [ ] ¿NO se están creando archivos .md innecesarios?

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0.0
**Mantenedor**: Equipo UNA-Chat
