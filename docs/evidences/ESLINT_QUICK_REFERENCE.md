# ESLint Quick Reference - LAB-5-JOSEGUADAMUZ

## 🚀 Comandos Principales

```bash
# Análisis completo del proyecto
npm run lint

# Corrección automática de problemas
npm run lint:fix

# Verificar configuración actual
npm run lint:check

# Generar reporte HTML
npm run lint:report

# Análizar archivo específico
npx eslint server.js

# Análizar con formato específico
npx eslint . --format stylish
npx eslint . --format json
```

## 🔧 Workflow Diario de Desarrollo

### 1. Antes de Escribir Código
```bash
# Verificar que ESLint esté funcionando
npm run lint
```

### 2. Durante el Desarrollo
- Activar ESLint en VS Code (extensión instalada)
- Ver errores en tiempo real en el editor
- Usar Ctrl+Shift+P > "ESLint: Fix all auto-fixable Problems"

### 3. Antes de Commit
```bash
# Corregir problemas automáticamente
npm run lint:fix

# Verificar que no queden errores críticos
npm run lint

# Si hay errores, corregir manualmente y repetir
```

## 📊 Interpretación de Resultados

### ✅ Resultado Exitoso
```bash
$ npm run lint
✔ 3 files linted successfully
  0 errors, 0 warnings
```

### ⚠️ Con Problemas
```bash
$ npm run lint
C:\...\server.js
  25:1  error   Use path.join() instead of string concatenation  n/no-path-concat
  30:3  warning Unexpected console statement                     no-console

✖ 2 problems (1 error, 1 warning)
```

### Niveles de Severidad
- **Error** (❌): Debe corregirse obligatoriamente
- **Warning** (⚠️): Recomendado corregir
- **Info** (ℹ️): Sugerencia de mejora

## 🛠️ Corrección de Problemas Comunes

### 1. Variables y Declaraciones
```javascript
// ❌ Error: Unexpected var, use let or const instead
var message = "Hello";

// ✅ Corregido
const message = "Hello";
let counter = 0;
```

### 2. Console Statements
```javascript
// ❌ Warning: Unexpected console statement
console.log("Debug info");

// ✅ Opciones:
// Opción 1: Usar logger apropiado
const logger = require('winston');
logger.info("Debug info");

// Opción 2: Deshabilitar para línea específica
console.log("Debug info"); // eslint-disable-line no-console

// Opción 3: Deshabilitar para bloque
/* eslint-disable no-console */
console.log("Debug info");
console.error("Error info");
/* eslint-enable no-console */
```

### 3. Expresiones Regulares Inseguras
```javascript
// ❌ Error: Unsafe Regular Expression
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// ✅ Corregido: Usar biblioteca validada
const validator = require('validator');
const isValidEmail = (email) => validator.isEmail(email);
```

### 4. Path Concatenation
```javascript
// ❌ Error: Use path.join() instead of string concatenation
const filePath = __dirname + '/public/index.html';

// ✅ Corregido
const path = require('path');
const filePath = path.join(__dirname, 'public', 'index.html');
```

### 5. Return en Finally
```javascript
// ❌ Error: Unsafe usage of ReturnStatement
try {
    // código
} finally {
    return false; // ❌ Peligroso
}

// ✅ Corregido
let result = false;
try {
    // código
    result = true;
} catch (error) {
    result = false;
}
return result;
```

## 🎯 Reglas de Seguridad Activas

| Regla | Nivel | Descripción |
|-------|--------|-------------|
| `security/detect-eval-with-expression` | Error | Previene uso de eval() |
| `security/detect-unsafe-regex` | Error | Detecta ReDoS vulnerability |
| `security/detect-object-injection` | Error | Previene injection attacks |
| `security/detect-child-process` | Error | Controla ejecución de procesos |
| `sonarjs/cognitive-complexity` | Error | Limita complejidad < 15 |
| `no-console` | Warning | Recomienda usar logger |

## 📁 Archivos Ignorados

ESLint **NO** analizará estos archivos (definidos en `.eslintignore`):
- `node_modules/`
- `dist/` y `build/`
- `*.min.js`
- `index.html`
- `docs/sbom-cyclonedx.json`
- Archivos `.env*`

## 🔧 Personalización

### Deshabilitar Regla Globalmente
En `.eslintrc.cjs`:
```javascript
rules: {
  'no-console': 'off', // Deshabilitada globalmente
  'sonarjs/cognitive-complexity': 'warn' // Cambiar a warning
}
```

### Deshabilitar Regla por Archivo
```javascript
/* eslint-disable no-console */
// Todo el archivo sin restricción de console

/* eslint-disable no-console, no-var */
// Múltiples reglas deshabilitadas
```

### Deshabilitar Regla por Línea
```javascript
console.log('Debug'); // eslint-disable-line no-console
const data = eval(userInput); // eslint-disable-line security/detect-eval-with-expression
```

## 📊 Métricas y Reportes

### Generar Estadísticas
```bash
# Contar problemas por tipo
npx eslint . --format json | jq '.[] | .messages[] | .ruleId' | sort | uniq -c | sort -nr

# Ver archivos con más problemas
npx eslint . --format json | jq '.[] | {file: .filePath, errors: (.messages | length)}' | sort
```

### Integración con CI/CD
```yaml
# .github/workflows/lint.yml
name: ESLint
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
```

## 🚨 Troubleshooting

### ESLint no funciona en VS Code
1. Instalar extensión "ESLint" oficial
2. Recargar VS Code: Ctrl+Shift+P > "Developer: Reload Window"
3. Verificar configuración en `File > Preferences > Settings > ESLint`

### Error: Cannot find module 'eslint-config-standard'
```bash
npm install --save-dev eslint-config-standard eslint-plugin-import eslint-plugin-n eslint-plugin-promise
```

### Error de parsing
Verificar en `.eslintrc.cjs`:
```javascript
parserOptions: {
  ecmaVersion: 'latest',
  sourceType: 'module' // o 'script'
}
```

## 📞 Recursos de Ayuda

- **Documentación oficial**: https://eslint.org/docs/
- **Reglas disponibles**: https://eslint.org/docs/rules/
- **Plugin de Seguridad**: https://github.com/eslint-community/eslint-plugin-security
- **SonarJS Plugin**: https://github.com/SonarSource/eslint-plugin-sonarjs

---

**📅 Última actualización**: 5 de noviembre de 2025  
**🔧 Version ESLint**: 8.57.1  
**📝 Mantenido por**: Equipo LAB-5-UNACHAT