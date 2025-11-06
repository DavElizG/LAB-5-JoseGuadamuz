# Análisis SBOM (Software Bill of Materials) - LAB-5-UNACHAT

## Información General del SBOM

**Proyecto**: LAB-5-JoseGuadamuz  
**Fecha de Generación**: 5 de noviembre de 2025, 19:11:52 UTC  
**Formato**: CycloneDX v1.6  
**Herramienta de Generación**: @cyclonedx/cyclonedx-npm v4.1.0  
**Total de Componentes**: 154 dependencias  

---

## Resumen Ejecutivo

Este análisis presenta el inventario completo de las dependencias del proyecto LAB-5-UNACHAT, incluyendo bibliotecas de terceros, frameworks, módulos y sus respectivas licencias. Se han identificado **15 vulnerabilidades de seguridad** distribuidas en 5 bajas, 3 moderadas y 7 altas, que requieren atención inmediata.

### Estadísticas Clave

- **Dependencias de Producción**: 154
- **Dependencias de Desarrollo**: 0
- **Dependencias Opcionales**: 1
- **Vulnerabilidades Totales**: 15
- **Nivel de Riesgo General**: **ALTO** ⚠️

---

## 1. Dependencias Principales (Direct Dependencies)

### 1.1 Frameworks y Bibliotecas Core

| Nombre | Versión | Licencia | Propósito | Estado |
|--------|---------|----------|-----------|--------|
| **express** | 4.18.2 | MIT | Framework web para Node.js | ⚠️ **7 vulnerabilidades** |
| **socket.io** | 4.7.2 | MIT | Comunicación WebSocket en tiempo real | ⚠️ **1 vulnerabilidad** |
| **mocha** | 10.2.0 | MIT | Framework de testing | ⚠️ **2 vulnerabilidades** |

### 1.2 Dependencias Indirectas Críticas

| Nombre | Versión | Licencia | Dependiente de | Riesgo |
|--------|---------|----------|----------------|--------|
| **body-parser** | < 1.20.3 | MIT | express | 🔴 **ALTO** |
| **path-to-regexp** | <= 0.1.11 | MIT | express | 🔴 **ALTO** |
| **ws** | 8.0.0 - 8.17.0 | MIT | socket.io/engine.io | 🔴 **ALTO** |
| **braces** | < 3.0.3 | MIT | Herramientas de build | 🔴 **ALTO** |
| **cookie** | < 0.7.0 | MIT | express/engine.io | 🟡 **BAJO** |
| **send** | < 0.19.0 | MIT | express | 🟡 **BAJO** |

---

## 2. Análisis de Licencias

### 2.1 Distribución de Licencias

| Licencia | Cantidad | Porcentaje | Riesgo Legal |
|----------|----------|------------|--------------|
| **MIT** | ~145 | 94.2% | 🟢 **BAJO** |
| **Apache-2.0** | ~5 | 3.2% | 🟢 **BAJO** |
| **ISC** | ~3 | 1.9% | 🟢 **BAJO** |
| **BSD** | ~1 | 0.7% | 🟢 **BAJO** |

### 2.2 Análisis de Compatibilidad

✅ **COMPATIBLE**: Todas las licencias identificadas (MIT, Apache-2.0, ISC, BSD) son compatibles con proyectos educativos y comerciales.

✅ **SIN RESTRICCIONES**: No se encontraron licencias copyleft restrictivas (GPL, AGPL).

✅ **CUMPLIMIENTO**: El proyecto cumple con los requisitos de atribución para todas las licencias utilizadas.

---

## 3. Matriz de Riesgos de Seguridad

### 3.1 Vulnerabilidades Críticas (CVSS ≥ 7.0)

| Componente | CVE/Advisory | CVSS | Severidad | Descripción | Estado |
|------------|--------------|------|-----------|-------------|--------|
| **body-parser** | GHSA-qwcr-r2fm-qrc7 | 7.5 | 🔴 **ALTA** | DoS cuando url encoding está habilitado | ⚠️ Parcheable |
| **braces** | GHSA-grv7-fg5c-xmjg | 7.5 | 🔴 **ALTA** | Consumo descontrolado de recursos | ⚠️ Parcheable |
| **path-to-regexp** | GHSA-9wv6-86v2-598j | 7.5 | 🔴 **ALTA** | Expresiones regulares con backtracking | ⚠️ Parcheable |
| **path-to-regexp** | GHSA-rhx6-c78j-4q9w | 7.5 | 🔴 **ALTA** | Contiene ReDoS | ⚠️ Parcheable |
| **ws** | GHSA-3h5v-q93c-6h6q | 7.5 | 🔴 **ALTA** | DoS con muchos headers HTTP | ⚠️ Parcheable |

### 3.2 Vulnerabilidades Moderadas (CVSS 4.0-6.9)

| Componente | CVE/Advisory | CVSS | Severidad | Descripción |
|------------|--------------|------|-----------|-------------|
| **express** | GHSA-rv95-896h-c2vc | 6.1 | 🟡 **MODERADA** | Open Redirect en URLs malformadas |
| **serialize-javascript** | GHSA-76p7-773f-r4q5 | 5.4 | 🟡 **MODERADA** | Cross-site Scripting (XSS) |
| **nanoid** | GHSA-mwcw-c2x4-8c55 | 4.3 | 🟡 **MODERADA** | Resultados predecibles en generación |

### 3.3 Vulnerabilidades Bajas (CVSS < 4.0)

| Componente | CVE/Advisory | CVSS | Severidad | Descripción |
|------------|--------------|------|-----------|-------------|
| **express** | GHSA-qw6h-vgh9-j6wx | 5.0 | 🟢 **BAJA** | XSS vía response.redirect() |
| **send** | GHSA-m6fv-jmcg-4jfg | 5.0 | 🟢 **BAJA** | Template injection que puede llevar a XSS |
| **serve-static** | GHSA-cm22-4g7w-348p | 5.0 | 🟢 **BAJA** | Template injection que puede llevar a XSS |
| **brace-expansion** | GHSA-v6h2-p8h4-qcjw | 3.1 | 🟢 **BAJA** | ReDoS en expresiones regulares |
| **cookie** | GHSA-pxg6-pf52-xh8x | 0.0 | 🟢 **BAJA** | Acepta caracteres fuera de límites |

---

## 4. Análisis de Dependencias por Categoría

### 4.1 Frameworks Web (Express.js Ecosystem)

```
express@4.18.2 (MIT)
├── body-parser@1.20.2 ⚠️
├── cookie@0.5.0 ⚠️
├── path-to-regexp@0.1.7 ⚠️
├── send@0.18.0 ⚠️
├── serve-static@1.15.0 ⚠️
└── [+40 subdependencias]
```

**Riesgo**: 🔴 **ALTO** - Múltiples vulnerabilidades en componentes core

### 4.2 Comunicación WebSocket (Socket.IO)

```
socket.io@4.7.2 (MIT)
├── engine.io@6.5.2 ⚠️
├── socket.io-adapter@2.5.2 ⚠️
├── ws@8.11.0 ⚠️
└── [+20 subdependencias]
```

**Riesgo**: 🟡 **MODERADO** - Vulnerabilidades en engine.io y ws

### 4.3 Testing Framework (Mocha)

```
mocha@10.2.0 (MIT)
├── nanoid@3.3.3 ⚠️
├── serialize-javascript@6.0.0 ⚠️
└── [+25 subdependencias]
```

**Riesgo**: 🟡 **MODERADO** - Vulnerabilidades en dependencias de testing

### 4.4 Utilidades y Herramientas

| Categoría | Ejemplos | Cantidad | Riesgo |
|-----------|----------|----------|--------|
| **Parsing/Regex** | brace-expansion, braces, path-to-regexp | ~15 | 🔴 **ALTO** |
| **HTTP/Network** | cookie, debug, ms | ~20 | 🟡 **MODERADO** |
| **Utilities** | lodash, mime-types, vary | ~30 | 🟢 **BAJO** |
| **Development** | chalk, glob, minimatch | ~25 | 🟢 **BAJO** |

---

## 5. Evaluación de Riesgo Inherente

### 5.1 Matriz de Riesgo por Componente

| Componente | Criticidad | Exposición | Impacto | Riesgo Final |
|------------|------------|------------|---------|--------------|
| **express** | 🔴 ALTA | 🔴 ALTA | 🔴 ALTA | 🔴 **CRÍTICO** |
| **socket.io** | 🟡 MEDIA | 🔴 ALTA | 🟡 MEDIA | 🔴 **ALTO** |
| **mocha** | 🟡 MEDIA | 🟢 BAJA | 🟡 MEDIA | 🟡 **MODERADO** |
| **path-to-regexp** | 🔴 ALTA | 🔴 ALTA | 🔴 ALTA | 🔴 **CRÍTICO** |
| **ws** | 🔴 ALTA | 🔴 ALTA | 🔴 ALTA | 🔴 **CRÍTICO** |
| **body-parser** | 🔴 ALTA | 🔴 ALTA | 🔴 ALTA | 🔴 **CRÍTICO** |

### 5.2 Factores de Riesgo

#### Riesgos Técnicos
- **DoS (Denial of Service)**: 5 vulnerabilidades que pueden causar indisponibilidad
- **XSS (Cross-Site Scripting)**: 3 vulnerabilidades de inyección de código
- **ReDoS (Regex DoS)**: 3 vulnerabilidades de expresiones regulares costosas
- **Open Redirect**: 1 vulnerabilidad de redirección maliciosa

#### Riesgos Operacionales
- **Dependencias Desactualizadas**: Todas las vulnerabilidades son en versiones no actualizadas
- **Superficie de Ataque**: 154 componentes aumentan la superficie de ataque
- **Mantenimiento**: Dependencias indirectas dificultan el control de versiones

#### Riesgos de Cumplimiento
- **Auditoría**: 15 vulnerabilidades conocidas fallan auditorías de seguridad
- **Producción**: Versiones vulnerables no aptas para producción
- **Reputación**: Vulnerabilidades públicas pueden afectar credibilidad del proyecto

---

## 6. Plan de Remediación Inmediata

### 6.1 Acciones Críticas (Inmediatas - 24h)

```bash
# 1. Actualizar todas las dependencias con parches de seguridad
npm audit fix

# 2. Actualizar manualmente dependencias principales
npm update express socket.io mocha

# 3. Verificar correcciones
npm audit

# 4. Regenerar SBOM
npx @cyclonedx/cyclonedx-npm --output-format json --output-file ./docs/sbom-cyclonedx.json
```

### 6.2 Acciones de Mejora (Corto Plazo - 1 semana)

1. **Implementar Snyk Monitoring**:
   ```bash
   snyk monitor
   snyk test
   ```

2. **Configurar GitHub Dependabot**:
   - Habilitar alertas de seguridad
   - Configurar PRs automáticos de actualización

3. **Integrar en CI/CD**:
   ```bash
   npm audit --audit-level=moderate
   ```

### 6.3 Políticas de Seguridad (Mediano Plazo - 1 mes)

1. **Política de Dependencias**:
   - No usar dependencias con vulnerabilidades ALTA o CRÍTICA
   - Revisar semanalmente `npm audit`
   - Actualizar trimestralmente dependencias principales

2. **Proceso de Evaluación**:
   - Evaluar nuevas dependencias antes de inclusión
   - Documentar justificación de dependencias críticas
   - Mantener SBOM actualizado

---

## 7. Recomendaciones Específicas

### 7.1 Express.js
- **Actualizar a Express 4.19.2+** para corregir Open Redirect
- **Migrar a Express 5.x** (cuando sea estable) para mejor seguridad
- **Implementar helmet.js** para headers de seguridad

### 7.2 Socket.IO
- **Actualizar a Socket.IO 4.7.5+** para corregir vulnerabilidades de engine.io
- **Configurar rate limiting** para WebSocket connections
- **Implementar autenticación** en conexiones WebSocket

### 7.3 Mocha
- **Actualizar a Mocha 10.5.3+** para corregir vulnerabilidades de dependencias
- **Considerar alternativas** como Jest o Vitest para mejor seguridad
- **Separar dependencias de test** del bundle de producción

---

## 8. Monitoreo Continuo

### 8.1 Herramientas Recomendadas

| Herramienta | Propósito | Frecuencia |
|-------------|-----------|------------|
| **npm audit** | Auditoría básica | Diaria |
| **Snyk** | Monitoreo avanzado | Continua |
| **OWASP Dependency Check** | Análisis SAST | Semanal |
| **GitHub Security Alerts** | Notificaciones automáticas | Continua |

### 8.2 Métricas de Seguridad

- **Tiempo de Respuesta**: < 24h para vulnerabilidades CRÍTICAS
- **Tiempo de Respuesta**: < 1 semana para vulnerabilidades ALTAS
- **Cobertura de Análisis**: 100% de dependencias escaneadas
- **Actualización**: SBOM regenerado semanalmente

---

## 9. Referencias y Recursos

### 9.1 Vulnerabilidades Específicas
- [GHSA-qwcr-r2fm-qrc7](https://github.com/advisories/GHSA-qwcr-r2fm-qrc7) - body-parser DoS
- [GHSA-9wv6-86v2-598j](https://github.com/advisories/GHSA-9wv6-86v2-598j) - path-to-regexp ReDoS
- [GHSA-3h5v-q93c-6h6q](https://github.com/advisories/GHSA-3h5v-q93c-6h6q) - ws DoS

### 9.2 Herramientas y Estándares
- [CycloneDX](https://cyclonedx.org/) - Estándar SBOM
- [NIST SP 800-161](https://csrc.nist.gov/publications/detail/sp/800-161/rev-1/final) - Supply Chain Risk Management
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Snyk Vulnerability Database](https://security.snyk.io/)

---

## 10. Conclusiones

### 10.1 Estado Actual
El proyecto LAB-5-UNACHAT presenta un **RIESGO ALTO** debido a 15 vulnerabilidades conocidas en sus dependencias principales. Las vulnerabilidades más críticas están en Express.js y sus dependencias relacionadas, que son componentes fundamentales de la aplicación.

### 10.2 Prioridades
1. **CRÍTICO**: Actualizar Express.js y dependencias relacionadas
2. **ALTO**: Actualizar Socket.IO y componentes WebSocket
3. **MODERADO**: Actualizar Mocha y dependencias de testing
4. **BAJO**: Implementar monitoreo continuo

### 10.3 Próximos Pasos
1. Ejecutar `npm audit fix` inmediatamente
2. Verificar funcionamiento tras actualizaciones
3. Implementar pipeline de seguridad continua
4. Documentar proceso de gestión de dependencias

---

**Documento Generado**: 5 de noviembre de 2025  
**Próxima Revisión**: 12 de noviembre de 2025  
**Responsable**: Equipo LAB-5-UNACHAT  
**Estado**: 🔴 **ACCIÓN REQUERIDA**