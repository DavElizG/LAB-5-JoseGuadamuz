# Instrucciones para Agentes de IA - Proyecto UNA-Chat

Este directorio contiene las instrucciones y estándares que deben seguir todos los agentes de IA al trabajar en el proyecto UNA-Chat.

## 📋 Archivos de Instrucciones

### 1. `development_standards.instructions.md`
**Propósito**: Define los estándares generales de desarrollo, convenciones de código y mejores prácticas.

**Aplica a**: Todos los archivos del proyecto (`**`)

**Contenido**:
- Principios fundamentales (Security by Design, tipado fuerte, etc.)
- Estructura de proyecto y escalabilidad
- Convenciones de código (nomenclatura, formato)
- Reglas de SonarQube
- Behavior-Driven Development (BDD)
- Linting y calidad de código
- Gestión de dependencias y SBOM
- Control de versiones con Git
- Referencias y recursos

**Cuándo usar**: Siempre que se cree o modifique código en el proyecto.

---

### 2. `technology_stack.instructions.md`
**Propósito**: Documentación específica de las tecnologías utilizadas en el proyecto.

**Aplica a**: Archivos JavaScript y HTML (`**/*.{js,html,json}`)

**Contenido**:
- **Node.js**: Configuración, best practices, seguridad
- **Express.js**: Configuración segura, middleware, manejo de errores
- **Socket.IO**: Configuración, validación, autenticación
- **Mocha**: Estructura de tests, hooks, mocking
- **HTML5**: Seguridad en el cliente, JavaScript del cliente
- **Validación y Sanitización**: validator.js, validación de URLs
- **Logging**: Winston logger
- **Variables de Entorno**: dotenv, configuración
- **Package.json Scripts**: Scripts recomendados

**Cuándo usar**: Cuando se trabaje con alguna de las tecnologías del stack.

---

### 3. `sonarqube_rules.instructions.md`
**Propósito**: Reglas específicas de SonarQube que deben cumplirse para mantener la calidad del código.

**Aplica a**: Archivos JavaScript (`**/*.js`)

**Contenido**:
- **Vulnerabilidades de Seguridad** (Bloqueantes):
  - SQL Injection, XSS, eval(), Path Traversal, ReDoS, Hardcoded Credentials
- **Bugs Críticos**:
  - Promesas no manejadas, comparación con NaN, variables no inicializadas
- **Code Smells Mayores**:
  - Complejidad ciclomática, funciones largas, muchos parámetros, código duplicado
- **Malas Prácticas**:
  - Uso de var, comparación con ==, console.log en producción
- **Configuración de SonarQube**
- **Quality Gates** y umbrales mínimos
- **Mapeo CWE/OWASP**

**Cuándo usar**: Durante el desarrollo para evitar problemas de calidad y seguridad.

---

### 4. `snyk_rules.instructions.md`
**Propósito**: Reglas de seguridad de Snyk que se aplican automáticamente.

**Aplica a**: Todos los archivos del proyecto (`**`)

**Contenido**:
- Ejecutar `snyk_code_scan` para nuevo código
- Intentar corregir issues encontrados
- Re-escanear después de correcciones
- Repetir hasta no encontrar nuevos issues

**Cuándo usar**: Automáticamente después de generar o modificar código.

---

## 🎯 Objetivo del Lab 5

Este proyecto es parte del **Lab 5 - DevSecOps** del curso de Seguridad Informática. Los objetivos son:

1. **Implementar escáner estático local** (VS Code Extensions)
   - Definir estándares de desarrollo
   - Levantar SBOM (Software Bill of Materials)
   - Integrar Snyk/Semgrep en VS Code
   - Configurar linting

2. **Implementar escáner estático en GitHub Actions** (SAST + Linting + Unit Tests)
3. **Escaneo de imágenes de contenedores**
4. **Testing y monitoreo de seguridad** (Bug Bounty)

---

## 🚀 Cómo Usar Estas Instrucciones

### Para Desarrolladores Humanos:
1. Lee cada archivo de instrucciones antes de empezar a codificar
2. Usa estos documentos como referencia durante el desarrollo
3. Verifica tu código contra estos estándares antes de hacer commit

### Para Agentes de IA:
1. Los archivos con extensión `.instructions.md` se cargan automáticamente
2. Sigue las reglas definidas en el `applyTo` pattern
3. Consulta estos documentos antes de generar o modificar código
4. No crees archivos `.md` adicionales a menos que se solicite explícitamente

---

## ✅ Checklist Rápido

Antes de cada commit, verifica:

- [ ] ✅ Código sigue convenciones de nomenclatura (camelCase, PascalCase, etc.)
- [ ] ✅ Se usa tipado fuerte con JSDoc
- [ ] ✅ Todas las entradas de usuario están validadas y sanitizadas
- [ ] ✅ Manejo apropiado de errores con try-catch
- [ ] ✅ Funciones < 50 líneas
- [ ] ✅ Complejidad ciclomática < 15
- [ ] ✅ Tests unitarios escritos (BDD style)
- [ ] ✅ Cobertura de tests ≥ 80%
- [ ] ✅ Sin vulnerabilidades Blocker/Critical en Snyk
- [ ] ✅ Sin code smells mayores en SonarQube
- [ ] ✅ Linting pasa sin errores
- [ ] ✅ No hay console.log en código de producción
- [ ] ✅ No hay credenciales hardcodeadas
- [ ] ✅ Dependencias actualizadas y sin vulnerabilidades

---

## 📚 Enlaces Importantes

### Documentación de Tecnologías
- [Node.js](https://nodejs.org/en/docs/)
- [Express.js](https://expressjs.com/)
- [Socket.IO](https://socket.io/docs/v4/)
- [Mocha](https://mochajs.org/)

### Seguridad
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [OWASP Node.js Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)

### Herramientas
- [Snyk](https://snyk.io/)
- [SonarQube](https://www.sonarqube.org/)
- [ESLint](https://eslint.org/)

### Guías de Estilo
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

## 🔄 Actualización de Instrucciones

Estas instrucciones deben actualizarse cuando:
- Se agregan nuevas tecnologías al stack
- Se identifican nuevos patrones de seguridad
- Se actualizan las reglas de SonarQube
- Se descubren nuevas mejores prácticas

**Última actualización**: Noviembre 2025  
**Versión**: 1.0.0  
**Equipo**: UNA-Chat DevSecOps Team

---

## ⚠️ Nota Importante

Estos archivos de instrucciones son **críticos** para mantener la seguridad y calidad del código. No deben ser modificados sin revisión del equipo completo.

Para sugerencias de mejora, crear un issue en GitHub con la etiqueta `instructions`.
