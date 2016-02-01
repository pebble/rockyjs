/*eslint "no-unused-expressions": 0*/
/* globals describe:false, it:false, xit: false, before:false */

var Module = require('../../src/transpiled.js');
var addManualSymbols = require('../../src/symbols-manual.js').addManualSymbols;
var addGeneratedSymbols =
  require('../../src/symbols-generated.js').addGeneratedSymbols;
var expect = require('chai').expect;

describe('GFont', function() {
  var rocky;
  before(function() {
    rocky = {
      module: Module()
    };
    addManualSymbols(rocky);
    addGeneratedSymbols(rocky);
  });

  describe('fonts_get_system_font', function() {
    var fonts_get_system_font;
    before(function() {
      fonts_get_system_font = rocky.fonts_get_system_font;
    });

    it('returns null for some cases', function() {
      expect(fonts_get_system_font(undefined)).to.be.null;
      expect(fonts_get_system_font(null)).to.be.null;
    });

    xit('returns callback font for unknown keys', function() {
      var font = fonts_get_system_font('unknownFontId');
      expect(font).to.have.a.property('captureCPointer').which.is.a('function');
      expect(font).to.have.a.property('releaseCPointer').which.is.a('function');
      expect(font.captureCPointer()).to.not.equal(0);
    });

    it('returns works with valid system fonts', function() {
      var font = fonts_get_system_font('RESOURCE_ID_GOTHIC_18_BOLD');
      expect(font).to.have.a.property('captureCPointer').which.is.a('function');
      expect(font).to.have.a.property('releaseCPointer').which.is.a('function');
      expect(font.captureCPointer()).to.not.equal(0);
    });
  });

  describe('graphics_text_layout_get_content_size_with_attributes', function() {
    var graphics_text_layout_get_content_size;
    var font;
    before(function() {
      font = rocky.fonts_get_system_font('RESOURCE_ID_GOTHIC_18_BOLD');
      graphics_text_layout_get_content_size =
        rocky.graphics_text_layout_get_content_size;
    });

    it('returns empty size for empty string', function() {
      var size = graphics_text_layout_get_content_size(
        '', font, [0, 0, 100, 100], 0, 0);
      expect(size).to.eql({w: 0, h: 0});
    });

    it('returns empty size for empty font', function() {
      var font = {captureCPointer: function() {return null;}};

      var size = graphics_text_layout_get_content_size(
        'some text', font, [0, 0, 100, 100], 0, 0);
      expect(size).to.eql({w: 0, h: 0});
    });

    it('works for normal cases', function() {
      var size = graphics_text_layout_get_content_size(
        'some text', font, [0, 0, 100, 100], 0, 0);
      expect(size).to.eql({w: 67, h: 18});
    });
  });

});
