var val = require('../libs/unalib');
var assert = require('assert');


describe('unalib', function(){


  describe('funcion is_valid_phone', function(){

    it('deberia devolver true para 8297-8547', function(){

      assert.equal(val.is_valid_phone('8297-8547'), true);

    });

    it('deberia devolver false para 8297p-8547', function(){

      assert.equal(val.is_valid_phone('8297p-8547'), false);

    });

  });


  describe('funcion is_valid_url_image', function(){

    it('deberia devolver true para http://image.com/image.jpg', function(){

      assert.equal(val.is_valid_url_image('http://image.com/image.jpg'), true);

    });

    it('deberia devolver true para http://image.com/image.gif', function(){

      assert.equal(val.is_valid_url_image('http://image.com/image.gif'), true);

    });

    it('deberia devolver true para http://image.com/image.png', function(){

      assert.equal(val.is_valid_url_image('http://image.com/image.png'), true);

    });

    it('deberia devolver true para https://example.com/image.webp', function(){

      assert.equal(val.is_valid_url_image('https://example.com/image.webp'), true);

    });

    it('deberia devolver true para https://example.com/image.svg', function(){

      assert.equal(val.is_valid_url_image('https://example.com/image.svg'), true);

    });

    it('deberia devolver false para http://example.com/notimage.txt', function(){

      assert.equal(val.is_valid_url_image('http://example.com/notimage.txt'), false);

    });
    
  });

  describe('funcion is_valid_yt_video', function(){

    it('deberia devolver true para https://www.youtube.com/watch?v=qYwlqx-JLok', function(){

      assert.equal(val.is_valid_yt_video('https://www.youtube.com/watch?v=qYwlqx-JLok'), true);

    });

    it('deberia devolver true para https://youtu.be/qYwlqx-JLok', function(){

      assert.equal(val.is_valid_yt_video('https://youtu.be/qYwlqx-JLok'), true);

    });

    it('deberia devolver false para https://notyoutube.com/watch?v=123', function(){

      assert.equal(val.is_valid_yt_video('https://notyoutube.com/watch?v=123'), false);

    });

  });

  describe('funcion is_valid_vimeo_video', function(){

    it('deberia devolver true para https://vimeo.com/123456789', function(){

      assert.equal(val.is_valid_vimeo_video('https://vimeo.com/123456789'), true);

    });

    it('deberia devolver true para https://www.vimeo.com/987654321', function(){

      assert.equal(val.is_valid_vimeo_video('https://www.vimeo.com/987654321'), true);

    });

    it('deberia devolver false para https://notvimeo.com/123', function(){

      assert.equal(val.is_valid_vimeo_video('https://notvimeo.com/123'), false);

    });

  });

  describe('funcion is_valid_direct_video', function(){

    it('deberia devolver true para http://example.com/video.mp4', function(){

      assert.equal(val.is_valid_direct_video('http://example.com/video.mp4'), true);

    });

    it('deberia devolver true para https://example.com/video.webm', function(){

      assert.equal(val.is_valid_direct_video('https://example.com/video.webm'), true);

    });

    it('deberia devolver false para http://example.com/notavideo.txt', function(){

      assert.equal(val.is_valid_direct_video('http://example.com/notavideo.txt'), false);

    });

  });

  describe('funcion is_valid_video', function(){

    it('deberia devolver true para YouTube URL', function(){

      assert.equal(val.is_valid_video('https://www.youtube.com/watch?v=qYwlqx-JLok'), true);

    });

    it('deberia devolver true para Vimeo URL', function(){

      assert.equal(val.is_valid_video('https://vimeo.com/123456789'), true);

    });

    it('deberia devolver true para direct video URL', function(){

      assert.equal(val.is_valid_video('http://example.com/video.mp4'), true);

    });

    it('deberia devolver false para non-video URL', function(){

      assert.equal(val.is_valid_video('http://example.com/document.pdf'), false);

    });

  });

  describe('funcion hasScriptInjection', function(){

    it('deberia detectar script tag basico', function(){

      assert.equal(val.hasScriptInjection('<script>alert("xss")</script>'), true);

    });

    it('deberia detectar javascript: protocol', function(){

      assert.equal(val.hasScriptInjection('javascript:alert("xss")'), true);

    });

    it('deberia detectar event handlers', function(){

      assert.equal(val.hasScriptInjection('onload=alert("xss")'), true);

    });

    it('deberia detectar iframe tag', function(){

      assert.equal(val.hasScriptInjection('<iframe src="evil.com"></iframe>'), true);

    });

    it('deberia devolver false para texto normal', function(){

      assert.equal(val.hasScriptInjection('Este es un mensaje normal'), false);

    });

    it('deberia devolver false para URLs válidas', function(){

      assert.equal(val.hasScriptInjection('https://example.com/image.jpg'), false);

    });

  });

  describe('funcion escapeHtml', function(){

    it('deberia escapar caracteres HTML basicos', function(){

      assert.equal(val.escapeHtml('<script>alert("test")</script>'), '&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt;');

    });

    it('deberia escapar ampersands', function(){

      assert.equal(val.escapeHtml('test & example'), 'test &amp; example');

    });

    it('deberia escapar comillas simples y dobles', function(){

      assert.equal(val.escapeHtml('test "quote" and \'apostrophe\''), 'test &quot;quote&quot; and &#039;apostrophe&#039;');

    });

  });

  describe('funcion validateMessage', function(){

    it('deberia bloquear script injection y devolver mensaje de seguridad', function(){

      var maliciousMsg = JSON.stringify({nombre: 'Hacker', mensaje: '<script>alert("xss")</script>', color: '#000'});
      var result = JSON.parse(val.validateMessage(maliciousMsg));
      
      assert.equal(result.mensaje, '⚠️ Contenido bloqueado por seguridad');

    });

    it('deberia procesar URLs de imagen correctamente', function(){

      var imageMsg = JSON.stringify({nombre: 'User', mensaje: 'http://example.com/image.jpg', color: '#000'});
      var result = JSON.parse(val.validateMessage(imageMsg));
      
      assert.equal(result.mensaje.includes('<img'), true);
      assert.equal(result.mensaje.includes('http://example.com/image.jpg'), true);

    });

    it('deberia procesar URLs de video de YouTube correctamente', function(){

      var videoMsg = JSON.stringify({nombre: 'User', mensaje: 'https://www.youtube.com/watch?v=qYwlqx-JLok', color: '#000'});
      var result = JSON.parse(val.validateMessage(videoMsg));
      
      assert.equal(result.mensaje.includes('<iframe'), true);
      assert.equal(result.mensaje.includes('youtube.com/embed'), true);

    });

    it('deberia escapar texto normal para prevenir XSS', function(){

      var textMsg = JSON.stringify({nombre: 'User', mensaje: 'Hello <b>world</b>', color: '#000'});
      var result = JSON.parse(val.validateMessage(textMsg));
      
      assert.equal(result.mensaje, 'Hello &lt;b&gt;world&lt;/b&gt;');

    });

    it('deberia manejar mensajes vacios o invalidos', function(){

      var result1 = JSON.parse(val.validateMessage(''));
      assert.equal(result1.mensaje, '');

      var result2 = JSON.parse(val.validateMessage(null));
      assert.equal(result2.mensaje, '');

    });

  });

});







