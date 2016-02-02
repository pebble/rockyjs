/*eslint "no-unused-expressions": 0*/
/*eslint max-len: [2, 100, 4]*/
/* globals describe:false, it:false, xit: false */
/* globals before:false, beforeEach: false, afterEach: false */

var Module = require('../../src/transpiled.js');
var addManualSymbols = require('../../src/symbols-manual.js').addManualSymbols;
var addGeneratedSymbols =
  require('../../src/symbols-generated.js').addGeneratedSymbols;
var expect = require('chai').expect;
var sinon = require('sinon');

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
      expect(font).to.have.a.property('status').equal('loaded');

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

  describe('non-system fonts', function() {
    var sandbox, font;
    beforeEach(function() {
      sandbox = sinon.sandbox.create();
      this.ccall = rocky.module.ccall;
      this.addFunction = rocky.module.Runtime.addFunction;
      font = rocky.fonts_load_custom_font_with_data('some data');
    });

    afterEach(function() {
      sandbox.verify();
      sandbox.restore();
      rocky.module.ccall = this.ccall;
      rocky.module.Runtime.addFunction = this.addFunction;
    });

    describe('fonts_load_custom_font_with_data', function() {
      it('simply passes the data', function() {
        expect(font).to.be.an('object');
        expect(font).to.have.a.property('status').which.equals('loaded');
        expect(font).to.have.a.property('data').which.equals('some data');
        expect(font).to.have.a.property('captureCPointer').which.is.a('function');
        expect(font).to.have.a.property('releaseCPointer').which.is.a('function');
      });
    });

    describe('capture and release pointer', function() {
      it('returns null if not loaded', function() {
        font.status = 'loading';
        sandbox.mock(rocky.module)
          .expects('ccall').never();
        var cPtr = font.captureCPointer();
        expect(cPtr).to.equal(0);
      });

      it('captureCPointer', function() {
        sandbox.mock(rocky.module.Runtime)
          .expects('addFunction').twice()
          .onCall(0).returns(123)
          .onCall(1).returns(456);
        var ccall = sandbox.mock(rocky.module)
          .expects('ccall').twice();
        ccall.onCall(0).returns(789)
             .onCall(1).returns(321);

        var cPtr = font.captureCPointer();
        expect(cPtr).to.equal(321);
        expect(font).to.have.a.property('read_cb').which.equals(123);
        expect(font).to.have.a.property('get_size_cb').which.equals(456);
        expect(font).to.have.a.property('resourceId').which.equals(789);

        // sinon's mocks don't seem to work with multiple expectations on the same mock
        // hence this check afterwards
        expect(ccall.getCall(0).args).to.eql(
          ['emx_resources_register_custom', 'number', ['number', 'number'], [123, 456]]);
        expect(ccall.getCall(1).args).to.eql(
          ['fonts_load_custom_font', 'number', ['number'], [789]]);
      });

      it('releaseCPointer', function() {
        var ccall = sandbox.mock(rocky.module)
          .expects('ccall').twice();
        sandbox.mock(rocky.module.Runtime)
          .expects('removeFunction').twice()
          .onCall(0).returns(456)
          .onCall(1).returns(123);

        font.read_cb = 123;
        font.get_size_cb = 456;
        font.resourceId = 789;
        font.releaseCPointer(321);

        expect(font).to.not.have.a.property('read_cb');
        expect(font).to.not.have.a.property('get_size_cb');
        expect(font).to.not.have.a.property('resourceId');

        // sinon's mocks don't seem to work with multiple expectations on the same mock
        // hence this check afterwards
        expect(ccall.getCall(0).args).to.eql(
          ['fonts_unload_custom_font', 'void', ['number'], [321]]);
        expect(ccall.getCall(1).args).to.eql(
          ['emx_resources_remove_custom', 'void', ['number'], [789]]);
      });
    });
  });
});
