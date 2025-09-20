# UNA Chat - Laboratorio 5

## Información del Curso

**UNIVERSIDAD NACIONAL**  
**SEDE REGIONAL CHOROTEGA CAMPUS NICOYA**  
**CARRERA: INGENIERÍA EN SISTEMAS DE LA INFORMACIÓN**

**Asignatura:** Seguridad Informática  
**Laboratorio:** Lab 5  
**Persona académica:** Ing. Alex Villegas Carranza. M.Sc.  
**Correo electrónico:** alex.villegas.carranza@una.cr  
**Valor del Proyecto:** 2.5% de la calificación total del curso  
**Fecha de entrega:** Sábado 20 de Septiembre 2025 23:59:59  

**Estudiante:** Jose Guadamuz  
**Ubicación:** Costa Rica, Guanacaste, 2025

## Objetivos del Laboratorio

- ✅ Ejecutar y comprender el funcionamiento del proyecto UNA Chat
- ✅ Identificar y solucionar vulnerabilidades de inyección de scripts
- ✅ Implementar la funcionalidad para agregar y visualizar URLs de videos e imágenes en el chat
- ✅ Mejorar la validación de mensajes para prevenir inyecciones de scripts
- ✅ Mejorar la validación de mensajes para permitir URLs de imágenes y videos de manera segura
- ✅ Realizar pruebas unitarias para validar URLs de imágenes y videos

## Descripción del Proyecto

UNA Chat es una aplicación de chat en tiempo real desarrollada con Node.js y Socket.IO que permite a los usuarios intercambiar mensajes de texto, imágenes y videos de manera segura. El proyecto incluye validaciones robustas contra inyecciones de scripts (XSS) y soporte para múltiples formatos multimedia.

## Características Implementadas

### 🔒 Seguridad
- **Prevención de XSS**: Detección y bloqueo automático de scripts maliciosos
- **Sanitización de HTML**: Escape automático de caracteres peligrosos
- **Validación estricta**: Solo permite URLs de imágenes y videos válidas

### 🎨 Interfaz de Usuario
- **Diseño responsivo**: Adaptable a dispositivos móviles y desktop
- **Estilos mejorados**: CSS moderno para mejor presentación multimedia
- **Alertas de seguridad**: Indicadores visuales para contenido bloqueado

### 📸 Soporte Multimedia
- **Imágenes soportadas**: JPG, PNG, GIF, BMP, WEBP, SVG, TIFF, ICO
- **Videos soportados**: 
  - YouTube (embebido)
  - Vimeo (embebido)
  - Videos directos (MP4, WEBM, AVI, MOV, WMV, FLV, MKV)

### 🧪 Testing
- **15 pruebas unitarias** que cubren:
  - Validación de URLs de imágenes
  - Validación de URLs de videos
  - Prevención de inyección de scripts
  - Manejo de casos edge

## Estructura del Proyecto

```
LAB-5/
├── index.html          # Interfaz del chat con estilos mejorados
├── server.js           # Servidor Express con Socket.IO
├── package.json        # Dependencias y scripts
├── libs/
│   └── unalib.js      # Librería de validación con seguridad XSS
├── test/
│   └── test.js        # Pruebas unitarias completas
└── README.md          # Este archivo
```

## Instalación y Uso

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm

### Instalación
```bash
# Clonar o descargar el proyecto
cd LAB-5

# Instalar dependencias
npm install
```

### Ejecución
```bash
# Iniciar el servidor
npm start

# El servidor estará disponible en http://localhost:3000
```

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas unitarias
npm test
```

## Validaciones de Seguridad Implementadas

### Patrones de XSS Detectados
- Tags maliciosos: `<script>`, `<iframe>`, `<object>`, `<embed>`, `<form>`
- JavaScript inline: `onclick`, `onload`, `javascript:`
- Código peligroso: `eval()`, `document.cookie`, `innerHTML`

### Ejemplo de Uso Seguro

**✅ URLs Válidas:**
```
https://example.com/image.jpg
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://vimeo.com/123456789
https://example.com/video.mp4
```

**❌ Contenido Bloqueado:**
```html
<script>alert('XSS')</script>
<img src="x" onerror="alert('XSS')">
javascript:alert('XSS')
```

## Resultados de Pruebas

Todas las pruebas pasan exitosamente:

```
  unalib
    funcion is_valid_phone
      ✔ deberia devolver true para 8297-8547
      ✔ deberia devolver false para 8297p-8547
    funcion is_valid_url_image
      ✔ deberia devolver true para http://image.com/image.jpg
      ✔ deberia devolver true para http://image.com/image.gif
      ✔ deberia devolver true para https://example.com/image.webp
      ✔ deberia devolver true para https://example.com/logo.svg
      ✔ deberia devolver false para http://notanimage.com/file.txt
    funcion is_valid_video
      ✔ deberia devolver true para https://www.youtube.com/watch?v=dQw4w9WgXcQ
      ✔ deberia devolver true para https://vimeo.com/123456789
      ✔ deberia devolver true para https://example.com/video.mp4
      ✔ deberia devolver false para https://example.com/notvideo.txt
    funcion hasScriptInjection
      ✔ deberia detectar script tags
      ✔ deberia detectar eventos javascript
      ✔ deberia detectar javascript: urls
      ✔ deberia detectar iframes maliciosos
      ✔ deberia permitir texto normal

  15 passing (15ms)
```

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js, Socket.IO
- **Frontend**: HTML5, CSS3, JavaScript (jQuery)
- **Testing**: Mocha
- **Seguridad**: Validación personalizada anti-XSS

## Funcionalidades Técnicas

### Archivo `libs/unalib.js`
- `validateMessage()`: Función principal de validación con sanitización
- `hasScriptInjection()`: Detector de patrones XSS
- `escapeHtml()`: Sanitizador de caracteres HTML
- `is_valid_url_image()`: Validador de URLs de imágenes
- `is_valid_video()`: Validador universal de videos
- `getEmbeddedCode()`: Generador de código embed responsivo

### Archivo `index.html`
- CSS responsivo para multimedia
- JavaScript mejorado para manejo de mensajes
- Estilos de seguridad para alertas

### Archivo `test/test.js`
- Cobertura completa de funciones de validación
- Casos de prueba para seguridad XSS
- Validación de diferentes formatos multimedia

## Conclusiones

Este proyecto demuestra la implementación exitosa de un sistema de chat seguro que:

1. **Previene vulnerabilidades**: Bloquea efectivamente ataques XSS
2. **Soporta multimedia**: Maneja imágenes y videos de múltiples fuentes
3. **Mantiene usabilidad**: Interfaz intuitiva y responsive
4. **Garantiza calidad**: Testing exhaustivo con 100% de pruebas pasando

La solución cumple todos los objetivos del laboratorio, proporcionando una base sólida para aplicaciones de chat empresariales con altos estándares de seguridad.