---
description: SonarQube Rules and Quality Standards for UNA-Chat Project
applyTo: "**/*.js"
---

# Reglas de SonarQube - Proyecto UNA-Chat

## 1. Vulnerabilidades de Seguridad (Bloqueantes)

### 1.1 SQL Injection (OWASP A1)
**Regla**: `javascript:S2077`

```javascript
// ❌ BLOQUEANTE - SQL Injection vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;
db.execute(query);

// ✅ CORRECTO - Usar prepared statements
const query = 'SELECT * FROM users WHERE id = ?';
db.execute(query, [userId]);
```

**CWE**: CWE-89
**Severidad**: Blocker
**OWASP**: A03:2021 - Injection

---

### 1.2 XSS - Cross-Site Scripting (OWASP A7)
**Regla**: `javascript:S5247`

```javascript
// ❌ BLOQUEANTE - XSS vulnerable
element.innerHTML = userInput;
document.write(userInput);

// ✅ CORRECTO - Usar textContent o sanitizar
element.textContent = userInput;
// O
const sanitized = validator.escape(userInput);
element.innerHTML = sanitized;
```

**CWE**: CWE-79
**Severidad**: Blocker
**OWASP**: A03:2021 - Injection

---

### 1.3 Uso de eval() y Function()
**Regla**: `javascript:S1523`

```javascript
// ❌ BLOQUEANTE - Code injection
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 1000);

// ✅ CORRECTO - Evitar eval completamente
// Si necesitas parsing JSON:
const data = JSON.parse(userInput);
```

**CWE**: CWE-95
**Severidad**: Blocker
**OWASP**: A03:2021 - Injection

---

### 1.4 Path Traversal
**Regla**: `javascript:S5042`

```javascript
// ❌ BLOQUEANTE - Path traversal
const filePath = `/uploads/${userFileName}`;
fs.readFile(filePath);

// ✅ CORRECTO - Validar y normalizar path
const path = require('path');
const fileName = path.basename(userFileName);
const filePath = path.join('/uploads', fileName);
if (!filePath.startsWith('/uploads/')) {
    throw new Error('Invalid path');
}
fs.readFile(filePath);
```

**CWE**: CWE-22
**Severidad**: Blocker
**OWASP**: A01:2021 - Broken Access Control

---

### 1.5 Regex Denial of Service (ReDoS)
**Regla**: `javascript:S5852`

```javascript
// ❌ CRÍTICO - ReDoS vulnerable
const regex = /^(a+)+$/;
regex.test(userInput); // Puede causar DoS

// ✅ CORRECTO - Regex eficiente
const regex = /^a+$/;
regex.test(userInput);

// ✅ MEJOR - Validar longitud primero
if (userInput.length > 100) {
    throw new Error('Input too long');
}
```

**CWE**: CWE-1333
**Severidad**: Critical
**OWASP**: A06:2021 - Vulnerable Components

---

### 1.6 Hardcoded Credentials
**Regla**: `javascript:S2068`

```javascript
// ❌ BLOQUEANTE - Credenciales hardcodeadas
const password = 'admin123';
const apiKey = 'sk-1234567890abcdef';

// ✅ CORRECTO - Usar variables de entorno
const password = process.env.DB_PASSWORD;
const apiKey = process.env.API_KEY;
```

**CWE**: CWE-798
**Severidad**: Blocker
**OWASP**: A07:2021 - Identification and Authentication Failures

---

## 2. Bugs Críticos

### 2.1 Promesas No Manejadas
**Regla**: `javascript:S4822`

```javascript
// ❌ CRÍTICO - Promise rejection no manejada
async function getData() {
    const result = await fetchAPI(); // Puede fallar
    return result;
}
getData(); // No hay .catch()

// ✅ CORRECTO - Siempre manejar errores
async function getData() {
    try {
        const result = await fetchAPI();
        return result;
    } catch (error) {
        logger.error('API fetch failed:', error);
        throw error;
    }
}

getData().catch(err => {
    console.error('Unhandled error:', err);
});
```

**Severidad**: Critical

---

### 2.2 Comparación con NaN
**Regla**: `javascript:S2688`

```javascript
// ❌ BUG - Siempre retorna false
if (value === NaN) {
    // Nunca se ejecuta
}

// ✅ CORRECTO - Usar isNaN() o Number.isNaN()
if (Number.isNaN(value)) {
    // Funciona correctamente
}
```

**Severidad**: Critical

---

### 2.3 Variables No Inicializadas
**Regla**: `javascript:S3353`

```javascript
// ❌ BUG - Variable no inicializada
let result;
if (condition) {
    result = calculateValue();
}
return result; // Puede ser undefined

// ✅ CORRECTO - Inicializar con valor por defecto
let result = null;
if (condition) {
    result = calculateValue();
}
return result;
```

**Severidad**: Major

---

## 3. Code Smells Mayores

### 3.1 Complejidad Ciclomática Alta
**Regla**: `javascript:S3776`
**Límite**: 15

```javascript
// ❌ CODE SMELL - Complejidad 18
function processData(data) {
    if (data) {
        if (data.type === 'A') {
            if (data.value > 10) {
                if (data.flag) {
                    // ... 14 condiciones más
                }
            }
        }
    }
}

// ✅ CORRECTO - Refactorizar
function processData(data) {
    if (!data) return null;
    
    const processor = getProcessor(data.type);
    return processor.process(data);
}

function getProcessor(type) {
    const processors = {
        'A': new ProcessorA(),
        'B': new ProcessorB()
    };
    return processors[type] || new DefaultProcessor();
}
```

**Severidad**: Major

---

### 3.2 Funciones Muy Largas
**Regla**: `javascript:S138`
**Límite**: 50 líneas

```javascript
// ❌ CODE SMELL - 80 líneas
function processMessage(message) {
    // ... 80 líneas de código
}

// ✅ CORRECTO - Dividir en funciones más pequeñas
function processMessage(message) {
    const validated = validateMessage(message);
    const sanitized = sanitizeMessage(validated);
    const formatted = formatMessage(sanitized);
    return saveMessage(formatted);
}

function validateMessage(message) {
    // 10 líneas
}

function sanitizeMessage(message) {
    // 10 líneas
}

function formatMessage(message) {
    // 10 líneas
}
```

**Severidad**: Major

---

### 3.3 Demasiados Parámetros
**Regla**: `javascript:S107`
**Límite**: 5 parámetros

```javascript
// ❌ CODE SMELL - 7 parámetros
function createUser(name, email, password, age, country, phone, address) {
    // ...
}

// ✅ CORRECTO - Usar objeto de configuración
function createUser(userData) {
    const { name, email, password, age, country, phone, address } = userData;
    // ...
}

// Uso
createUser({
    name: 'John',
    email: 'john@example.com',
    password: 'secure123',
    age: 30,
    country: 'CR',
    phone: '88888888',
    address: 'San José'
});
```

**Severidad**: Major

---

### 3.4 Código Duplicado
**Regla**: `javascript:S1192`

```javascript
// ❌ CODE SMELL - Strings duplicados
if (user.role === 'administrator') {
    logger.log('administrator access');
}
if (checkRole('administrator')) {
    // ...
}

// ✅ CORRECTO - Usar constantes
const ROLE_ADMIN = 'administrator';

if (user.role === ROLE_ADMIN) {
    logger.log(`${ROLE_ADMIN} access`);
}
if (checkRole(ROLE_ADMIN)) {
    // ...
}
```

**Severidad**: Minor

---

### 3.5 Bloques Vacíos de Catch
**Regla**: `javascript:S1186`

```javascript
// ❌ CODE SMELL - Catch vacío
try {
    riskyOperation();
} catch (e) {
    // Sin manejo de error
}

// ✅ CORRECTO - Manejar o re-lanzar error
try {
    riskyOperation();
} catch (error) {
    logger.error('Operation failed:', error);
    throw error; // Re-lanzar si no se puede manejar
}
```

**Severidad**: Major

---

### 3.6 Callback Hell
**Regla**: `javascript:S134`
**Límite**: 3 niveles de anidación

```javascript
// ❌ CODE SMELL - Demasiada anidación
getData(function(a) {
    getMoreData(a, function(b) {
        getMoreData(b, function(c) {
            getMoreData(c, function(d) {
                // ...
            });
        });
    });
});

// ✅ CORRECTO - Usar async/await
async function fetchAllData() {
    const a = await getData();
    const b = await getMoreData(a);
    const c = await getMoreData(b);
    const d = await getMoreData(c);
    return d;
}
```

**Severidad**: Major

---

## 4. Malas Prácticas

### 4.1 Uso de var
**Regla**: `javascript:S3504`

```javascript
// ❌ MAL - Usar var
var count = 0;

// ✅ BIEN - Usar const o let
const MAX_COUNT = 100;
let count = 0;
```

**Severidad**: Minor

---

### 4.2 Comparación con == en lugar de ===
**Regla**: `javascript:S1440`

```javascript
// ❌ MAL - Comparación débil
if (value == '5') {
    // true para 5 y '5'
}

// ✅ BIEN - Comparación estricta
if (value === '5') {
    // Solo true para '5'
}
```

**Severidad**: Minor

---

### 4.3 console.log en Producción
**Regla**: `javascript:S2228`

```javascript
// ❌ MAL - console.log en producción
console.log('Debug info:', data);
console.error('Error:', error);

// ✅ BIEN - Usar logger apropiado
logger.debug('Debug info:', data);
logger.error('Error:', error);

// O condicional
if (process.env.NODE_ENV === 'development') {
    console.log('Debug info:', data);
}
```

**Severidad**: Minor

---

### 4.4 Funciones No Utilizadas
**Regla**: `javascript:S1172`

```javascript
// ❌ CODE SMELL - Función no utilizada
function unusedFunction() {
    return 'never called';
}

// ✅ BIEN - Eliminar código muerto
// O exportar si es parte de API
module.exports = {
    usedFunction
};
```

**Severidad**: Minor

---

## 5. Configuración de SonarQube

### 5.1 sonar-project.properties
```properties
# Identificación del proyecto
sonar.projectKey=una-chat
sonar.projectName=UNA Chat
sonar.projectVersion=1.0.0

# Configuración de fuentes
sonar.sources=.
sonar.exclusions=**/node_modules/**,**/test/**,**/coverage/**

# Tests
sonar.tests=test/
sonar.test.inclusions=test/**/*.test.js

# Cobertura
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Codificación
sonar.sourceEncoding=UTF-8

# Lenguaje
sonar.language=js
```

### 5.2 .sonarignore
```
# Dependencias
node_modules/
package-lock.json

# Tests
coverage/
*.test.js

# Build
dist/
build/

# Configuración
.env
.env.*
```

---

## 6. Quality Gates

### 6.1 Umbrales Mínimos
- **Cobertura de Código**: ≥ 80%
- **Código Duplicado**: ≤ 3%
- **Vulnerabilidades**: 0 (Blocker, Critical)
- **Bugs**: 0 (Blocker, Critical)
- **Code Smells**: ≤ 5 (Major)
- **Deuda Técnica**: ≤ 5% del tiempo de desarrollo
- **Complejidad Ciclomática**: ≤ 15 por función
- **Mantenibilidad**: Rating A o B

### 6.2 Condiciones de Bloqueo
El pipeline **NO** debe continuar si:
- Hay vulnerabilidades de seguridad (Blocker o Critical)
- Hay bugs críticos (Blocker o Critical)
- La cobertura de tests es < 80%
- El rating de seguridad es E o D

---

## 7. Matriz de Severidad

| Severidad | Descripción | Acción Requerida |
|-----------|-------------|------------------|
| **Blocker** | Vulnerabilidad crítica de seguridad | Corregir inmediatamente |
| **Critical** | Bug que causa fallo del sistema | Corregir antes de merge |
| **Major** | Code smell que afecta mantenibilidad | Corregir en próximo sprint |
| **Minor** | Mejora de estilo o convención | Corregir cuando sea posible |
| **Info** | Sugerencia informativa | Opcional |

---

## 8. Mapeo CWE/OWASP

### Vulnerabilidades más comunes en Node.js:

| Regla SonarQube | CWE | OWASP 2021 | Descripción |
|-----------------|-----|------------|-------------|
| S2077 | CWE-89 | A03 | SQL Injection |
| S5247 | CWE-79 | A03 | XSS |
| S1523 | CWE-95 | A03 | Code Injection |
| S5042 | CWE-22 | A01 | Path Traversal |
| S5852 | CWE-1333 | A06 | ReDoS |
| S2068 | CWE-798 | A07 | Hardcoded Credentials |
| S4829 | CWE-319 | A02 | Cleartext Protocol |
| S5332 | CWE-326 | A02 | Weak Encryption |
| S2245 | CWE-330 | A02 | Weak Random |
| S5743 | CWE-611 | A05 | XXE |

---

## 9. Integración con GitHub Actions

### 9.1 Workflow Example
```yaml
name: SonarQube Analysis

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main, development]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm run test:coverage
      
      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}
      
      - name: Quality Gate Check
        uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

## 10. Checklist de Cumplimiento

Antes de hacer commit/push:

- [ ] ✅ No hay vulnerabilidades Blocker o Critical
- [ ] ✅ No hay bugs Blocker o Critical
- [ ] ✅ Cobertura de tests ≥ 80%
- [ ] ✅ Complejidad ciclomática ≤ 15
- [ ] ✅ No hay funciones > 50 líneas
- [ ] ✅ No hay código duplicado > 3%
- [ ] ✅ No hay console.log en código de producción
- [ ] ✅ No hay credenciales hardcodeadas
- [ ] ✅ Todas las promesas tienen manejo de errores
- [ ] ✅ Se usa === en lugar de ==
- [ ] ✅ Se usa const/let en lugar de var

---

## 11. Referencias

### Documentación SonarQube
- **SonarQube Docs**: https://docs.sonarqube.org/latest/
- **JavaScript Rules**: https://rules.sonarsource.com/javascript
- **Quality Gates**: https://docs.sonarqube.org/latest/user-guide/quality-gates/

### Estándares de Seguridad
- **OWASP Top 10 2021**: https://owasp.org/Top10/
- **CWE Top 25**: https://cwe.mitre.org/top25/
- **SANS Top 25**: https://www.sans.org/top25-software-errors/

### Herramientas Complementarias
- **ESLint + SonarJS**: https://github.com/SonarSource/eslint-plugin-sonarjs
- **SonarLint IDE Extension**: https://www.sonarlint.org/

---

**Última actualización**: Noviembre 2025
**Versión**: 1.0.0
**Cumplimiento**: OWASP Top 10 2021, CWE Top 25
