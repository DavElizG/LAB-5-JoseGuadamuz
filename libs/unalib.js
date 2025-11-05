// modulo de ejemplo.

module.exports = {


  // logica que valida si un telefono esta correcto...
  is_valid_phone: function (phone) {
    // inicializacion lazy
    let isValid = false;
    // expresion regular copiada de StackOverflow
    const re = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/i;
  
    // validacion Regex
    try {
      isValid = re.test(phone);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
    // fin del try-catch block
  },
  
  is_valid_url_image: function (url) {
  
    // inicializacion lazy
    let isValid = false;
    // expresion regular mejorada para soportar más formatos
    const re = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|bmp|webp|svg|tiff|ico)/i;
  
    // validacion Regex
    try {
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
    // fin del try-catch block
  },
  
  is_valid_yt_video: function (url) {
  
    // inicializacion lazy
    let isValid = false;
    // expresion regular copiada de StackOverflow
    const re = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})?$/i;
  
    // validacion Regex
    try {
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
    // fin del try-catch block
  },

  // Función para validar videos de Vimeo
  is_valid_vimeo_video: function (url) {
    let isValid = false;
    const re = /^(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)/i;
      
    try {
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
  },

  // Función para validar videos directos (mp4, webm, etc.)
  is_valid_direct_video: function (url) {
    let isValid = false;
    const re = /(http(s?):)([/|.|\w|\s|-])*\.(?:mp4|webm|avi|mov|wmv|flv|mkv)/i;
      
    try {
      isValid = re.test(url);
    } catch (e) {
      console.log(e);
    } finally {
      return isValid;
    }
  },

  // Función general para validar cualquier tipo de video
  is_valid_video: function (url) {
    return this.is_valid_yt_video(url) || 
             this.is_valid_vimeo_video(url) || 
             this.is_valid_direct_video(url);
  },
  
  getYTVideoId: function(url){
  
    return url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)[1];
  },

  getVimeoVideoId: function(url){
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:vimeo\.com\/)(\d+)/);
    return match ? match[1] : null;
  },

  getEmbeddedCode: function (url){
    if (this.is_valid_yt_video(url)) {
      var id = this.getYTVideoId(url);
      return '<iframe width="560" height="315" src="https://www.youtube.com/embed/'+id+ '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    } else if (this.is_valid_vimeo_video(url)) {
      var id = this.getVimeoVideoId(url);
      return '<iframe src="https://player.vimeo.com/video/'+id+'" width="560" height="315" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else if (this.is_valid_direct_video(url)) {
      return '<video width="560" height="315" controls><source src="'+url+'" type="video/mp4">Tu navegador no soporta videos HTML5.</video>';
    }
    return '';
  },
  
  getImageTag: function(url){
    return '<img src="'+url+'" style="max-height: 400px;max-width: 400px;">';
  },
  
  // Función para escapar HTML y prevenir XSS
  escapeHtml: function(unsafe) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  // Función para detectar intentos de inyección de scripts
  hasScriptInjection: function(text) {
    if (!text || typeof text !== 'string') {
      return false;
    }
      
    // Patrones comunes de inyección de scripts
    const scriptPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<object/gi,
      /<embed/gi,
      /<form/gi,
      /eval\s*\(/gi,
      /document\.cookie/gi,
      /document\.write/gi,
      /innerHTML/gi,
      /outerHTML/gi
    ];
      
    return scriptPatterns.some(pattern => pattern.test(text));
  },

  validateMessage: function(msg){
    // Handle invalid input
    if (!msg || typeof msg !== 'string') {
      return JSON.stringify({ mensaje: '' });
    }

    try {
      const obj = JSON.parse(msg);
        
      // Validar que el mensaje existe
      if (!obj.mensaje || typeof obj.mensaje !== 'string') {
        obj.mensaje = '';
        return JSON.stringify(obj);
      }

      // Detectar y bloquear intentos de inyección de scripts
      if (this.hasScriptInjection(obj.mensaje)) {
        console.log('¡Intento de inyección de script detectado y bloqueado!');
        obj.mensaje = '⚠️ Contenido bloqueado por seguridad';
        return JSON.stringify(obj);
      }

      // Validar URLs de imágenes
      if(this.is_valid_url_image(obj.mensaje)){
        console.log('Es una imagen!');
        obj.mensaje = this.getImageTag(obj.mensaje);
      }
      // Validar URLs de videos (YouTube, Vimeo, directos)
      else if(this.is_valid_video(obj.mensaje)){
        console.log('Es un video!');
        obj.mensaje = this.getEmbeddedCode(obj.mensaje);
      }
      // Para texto normal, escapar HTML para prevenir XSS
      else{
        console.log('Es un texto!');
        obj.mensaje = this.escapeHtml(obj.mensaje);
      }
        
      return JSON.stringify(obj);
    } catch (e) {
      console.log('Error processing message:', e);
      return JSON.stringify({ mensaje: this.escapeHtml(msg) }); // Return escaped message on error
    }
  }
  
  
  
    
    
  
  // fin del modulo
};
  