/*eslint "no-unused-expressions": 0*/
/* globals describe:false, it:false, beforeEach:false, afterEach:false */

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var symbols = require('../../src/symbols-manual.js').symbols;
var expect = require('chai').expect;
var sinon = require('sinon');

describe('GBitmap', function() {

  var sandbox;
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    symbols.module = {ccall: function() {}};
  });

  afterEach(function() {
    sandbox.verify();
    delete symbols.module;
    sandbox.restore();
    delete global.XMLHttpRequest;
  });

  describe('gbitmap_create', function() {
    var gbitmap_create = symbols.gbitmap_create;
    it('creates an object with expected fields', function() {
      var bmp = gbitmap_create();
      expect(bmp).to.be.an('object');
      expect(bmp.status).to.be.a('string');
      expect(bmp.captureCPointer).to.be.a('function');
      expect(bmp.releaseCPointer).to.be.a('function');
    });

    it('implements captureCPointer with Data and module', function() {
      var bmp = gbitmap_create();
      bmp.data = 'some data';
      sandbox.mock(symbols.Data)
        .expects('captureCPointerWithData').once().withArgs('some data')
        .returns(123);
      sandbox.mock(symbols.module)
        .expects('ccall').once()
        .withArgs('gbitmap_create_with_data', 'number', ['number'], [123])
        .returns(456);

      expect(bmp.captureCPointer()).to.equal(456);
      expect(bmp.dataPtr).to.equal(123);
      expect(bmp.bmpPtr).to.equal(456);
    });

    it('implements releaseCPointer with Data and module', function() {
      var bmp = gbitmap_create();
      bmp.dataPtr = 123;
      bmp.bmpPtr = 456;

      sandbox.mock(symbols.module)
        .expects('ccall').once()
        .withArgs('gbitmap_destroy', 'void', ['number'], [456]);
      sandbox.mock(symbols.Data)
        .expects('releaseCPointer').once().withArgs(123);

      bmp.releaseCPointer(bmp.bmpPtr);
      expect(bmp.dataPtr).to.be.undefined;
      expect(bmp.bmpPtr).to.be.undefined;
    });

    it('reflects status and data according to Recources singleton', function() {
      var expectation = sandbox.mock(symbols.Resources)
        .expects('load').once().withArgs('someUrl').returns('someInitialStatus');
      var bmp = gbitmap_create('someUrl');
      var dataCallback = expectation.firstCall.args[1];
      expect(dataCallback).to.be.a('function');

      expect(bmp.status).to.equal('someInitialStatus');
      dataCallback('new status', 'some data');
      expect(bmp.status).to.equal('new status');
      expect(bmp.data).to.equal('some data');
    });

    describe('.onload and .onerror', function() {
      var bmp;
      var server;

      beforeEach(function() {
        server = sinon.fakeServer.create();
      });

      afterEach(function() {
        bmp.onload.verify();
        bmp.onerror.verify();
        server.restore();
      });

      it('calls .onload on success', function() {
        server.respondWith('GET', 'someUrl',
          [200, { 'Content-Type': 'application/json' }, '[{ "data": 123 }]']);
        bmp = gbitmap_create('someUrl');
        expect(bmp.status).to.equal('loading');

        bmp.onload = sinon.expectation.create('onload').once();
        bmp.onerror = sinon.expectation.create('onerror').never();

        server.respond();
        expect(bmp.status).to.equal('loaded');
      });

      it('calls .onerror on failure', function() {
        bmp = gbitmap_create('someUrl');
        expect(bmp.status).to.equal('loading');

        bmp.onload = sinon.expectation.create('onload').never();
        bmp.onerror = sinon.expectation.create('onerror').once();

        server.respond();
        expect(bmp.status).to.equal('error'); // 404
      });
    });

  });

  describe('gbitmap_create_with_data', function() {
    it('simply passes the data', function() {
      var bmp = symbols.gbitmap_create_with_data('some data');
      expect(bmp).to.be.an('object');
      expect(bmp.status).to.equal('loaded');
      expect(bmp.data).to.equal('some data');
      expect(bmp.captureCPointer).to.be.a('function');
      expect(bmp.releaseCPointer).to.be.a('function');
    });

    it('handles undefined data', function() {
      var bmp = symbols.gbitmap_create_with_data();
      sandbox.mock(symbols.Data)
        .expects('captureCPointerWithData').once().withArgs(undefined).returns(0);
      sandbox.mock(symbols.module)
        .expects('ccall').never();
      expect(bmp.captureCPointer()).to.equal(0);
    });
  });

});
