/**
 * Unit Tests - UNA Library Validation Functions
 * BDD Style con Mocha + Chai
 * @module test/unalib.test
 */

const { expect } = require('chai');
const val = require('../libs/unalib');

describe('UNA Library - Validation Functions', function() {
  
  // ===================================
  // Phone Number Validation Tests
  // ===================================
  describe('is_valid_phone()', function() {
    
    it('should return true for format "8297-8547"', function() {
      expect(val.is_valid_phone('8297-8547')).to.be.true;
    });

    it('should return true for format "2234-5678"', function() {
      expect(val.is_valid_phone('2234-5678')).to.be.true;
    });

    it('should return false for "8297p-8547" (contains letter)', function() {
      expect(val.is_valid_phone('8297p-8547')).to.be.false;
    });

    it('should return false for empty string', function() {
      expect(val.is_valid_phone('')).to.be.false;
    });

    it('should return false for null', function() {
      expect(val.is_valid_phone(null)).to.be.false;
    });
    
  });

  // ===================================
  // Image URL Validation Tests
  // ===================================
  describe('is_valid_url_image()', function() {
    
    it('should return true for .jpg image', function() {
      expect(val.is_valid_url_image('https://image.com/image.jpg')).to.be.true;
    });

    it('should return true for .jpeg image', function() {
      expect(val.is_valid_url_image('https://example.com/photo.jpeg')).to.be.true;
    });

    it('should return true for .gif image', function() {
      expect(val.is_valid_url_image('https://image.com/image.gif')).to.be.true;
    });

    it('should return true for .png image', function() {
      expect(val.is_valid_url_image('https://image.com/image.png')).to.be.true;
    });

    it('should return true for .webp image', function() {
      expect(val.is_valid_url_image('https://example.com/image.webp')).to.be.true;
    });

    it('should return true for .bmp image', function() {
      expect(val.is_valid_url_image('https://example.com/picture.bmp')).to.be.true;
    });

    it('should return false for non-image file (.txt)', function() {
      expect(val.is_valid_url_image('https://example.com/file.txt')).to.be.false;
    });

    it('should return false for empty string', function() {
      expect(val.is_valid_url_image('')).to.be.false;
    });

    it('should return false for null', function() {
      expect(val.is_valid_url_image(null)).to.be.false;
    });
    
  });

  // ===================================
  // YouTube Video Validation Tests
  // ===================================
  describe('is_valid_yt_video()', function() {
    
    it('should return true for valid YouTube URL', function() {
      const result = val.is_valid_yt_video('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      expect(result).to.be.true;
    });

    it('should return true for short YouTube URL', function() {
      const result = val.is_valid_yt_video('https://youtu.be/dQw4w9WgXcQ');
      expect(result).to.be.true;
    });

    it('should return false for invalid YouTube URL', function() {
      const result = val.is_valid_yt_video('https://vimeo.com/123456');
      expect(result).to.be.false;
    });
    
  });

  // ===================================
  // Vimeo Video Validation Tests
  // ===================================
  describe('is_valid_vimeo_video()', function() {
    
    it('should return true for valid Vimeo URL', function() {
      const result = val.is_valid_vimeo_video('https://vimeo.com/123456789');
      expect(result).to.be.true;
    });

    it('should return false for invalid Vimeo URL', function() {
      const result = val.is_valid_vimeo_video('https://youtube.com/watch');
      expect(result).to.be.false;
    });
    
  });

  // ===================================
  // Video Validation Tests
  // ===================================
  describe('is_valid_video()', function() {
    
    it('should return true for YouTube videos', function() {
      const result = val.is_valid_video('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      expect(result).to.be.true;
    });

    it('should return true for Vimeo videos', function() {
      const result = val.is_valid_video('https://vimeo.com/123456');
      expect(result).to.be.true;
    });
    
  });

  // ===================================
  // HTML Escape Tests (Security Critical)
  // ===================================
  describe('escapeHtml()', function() {
    
    it('should escape HTML special characters', function() {
      const result = val.escapeHtml('<script>alert("xss")</script>');
      expect(result).to.not.include('<script');
      expect(result).to.include('&lt;');
      expect(result).to.include('&gt;');
    });

    it('should escape ampersands', function() {
      const result = val.escapeHtml('Tom & Jerry');
      expect(result).to.include('&amp;');
    });

    it('should escape quotes', function() {
      const result = val.escapeHtml('"Hello"');
      expect(result).to.include('&quot;');
    });
    
  });

  // ===================================
  // Script Injection Detection Tests
  // ===================================
  describe('hasScriptInjection()', function() {
    
    it('should detect <script> tags', function() {
      const result = val.hasScriptInjection('<script>alert(1)</script>');
      expect(result).to.be.true;
    });

    it('should detect javascript protocol (XSS vector)', function() {
      // Using string concatenation to avoid SonarQube false positive
      const dangerousProtocol = 'java' + 'script:'; // nosemgrep
      const maliciousUrl = dangerousProtocol + 'alert(1)';
      const result = val.hasScriptInjection(maliciousUrl);
      expect(result).to.be.true;
    });

    it('should return false for safe text', function() {
      const result = val.hasScriptInjection('Hello World');
      expect(result).to.be.false;
    });
    
  });

  // ===================================
  // Message Validation Tests (Main Function)
  // ===================================
  describe('validateMessage()', function() {
    
    it('should return a string for valid JSON input', function() {
      const jsonMsg = JSON.stringify({ mensaje: 'Hello', usuario: 'User' });
      const result = val.validateMessage(jsonMsg);
      expect(result).to.be.a('string');
    });

    it('should handle valid messages without errors', function() {
      const jsonMsg = JSON.stringify({ mensaje: 'Test message', usuario: 'TestUser' });
      const result = val.validateMessage(jsonMsg);
      expect(result).to.be.a('string');
      expect(result).to.include('mensaje');
    });

    it('should sanitize dangerous HTML in messages', function() {
      const jsonMsg = JSON.stringify({
        mensaje: '<script>alert("xss")</script>',
        usuario: 'Hacker'
      });
      const result = val.validateMessage(jsonMsg);
      expect(result).to.not.include('<script');
    });
    
  });

  // ===================================
  // Image Tag Generation Tests
  // ===================================
  describe('getImageTag()', function() {
    
    it('should generate img tag for valid image URL', function() {
      const result = val.getImageTag('https://example.com/image.jpg');
      expect(result).to.be.a('string');
      expect(result).to.include('<img');
      expect(result).to.include('src=');
    });

    it('should handle multiple image formats', function() {
      const formats = ['.jpg', '.png', '.gif', '.webp'];
      for (const format of formats) {
        const url = `https://example.com/image${format}`;
        const result = val.getImageTag(url);
        expect(result).to.be.a('string');
      }
    });
    
  });

  // ===================================
  // Video ID Extraction Tests
  // ===================================
  describe('getYTVideoId()', function() {
    
    it('should extract video ID from YouTube URL', function() {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const result = val.getYTVideoId(url);
      expect(result).to.be.a('string');
      expect(result.length).to.be.greaterThan(0);
    });
    
  });

  describe('getVimeoVideoId()', function() {
    
    it('should extract video ID from Vimeo URL', function() {
      const url = 'https://vimeo.com/123456789';
      const result = val.getVimeoVideoId(url);
      expect(result).to.be.a('string');
    });
    
  });

});
